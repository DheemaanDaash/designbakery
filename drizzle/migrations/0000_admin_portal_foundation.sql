
-- Enums
CREATE TYPE public.app_role AS ENUM ('admin','client');
CREATE TYPE public.request_status AS ENUM ('new','under_review','in_progress','awaiting_client','revision','completed','cancelled');
CREATE TYPE public.contact_status AS ENUM ('new','in_progress','replied','archived');

-- Roles
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

-- Profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text CHECK (char_length(full_name) <= 100),
  phone text CHECK (char_length(phone) <= 30),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO authenticated;
GRANT UPDATE (full_name, phone) ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own profile or admin" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Update own profile" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER profiles_touch BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Design requests: extend
ALTER TABLE public.design_requests
  ADD COLUMN client_id uuid,
  ADD COLUMN status public.request_status NOT NULL DEFAULT 'new',
  ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN completed_at timestamptz,
  ADD COLUMN delivery_link text CHECK (delivery_link IS NULL OR (char_length(delivery_link) <= 1000 AND delivery_link ~* '^https?://')),
  ADD CONSTRAINT dr_len CHECK (
    char_length(request_name) <= 150 AND char_length(design_content) <= 2000
    AND char_length(email) <= 255 AND char_length(coalesce(reference_link,'')) <= 500);
CREATE INDEX design_requests_client_idx ON public.design_requests(client_id);
CREATE INDEX design_requests_status_idx ON public.design_requests(status, created_at DESC);
CREATE INDEX design_requests_email_idx ON public.design_requests(lower(email));

GRANT SELECT, UPDATE, DELETE ON public.design_requests TO authenticated;
GRANT ALL ON public.design_requests TO service_role;
CREATE POLICY "Clients read own requests, admin all" ON public.design_requests FOR SELECT TO authenticated
  USING (client_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admin updates requests" ON public.design_requests FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admin deletes requests" ON public.design_requests FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.design_requests_before_insert()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF coalesce(auth.jwt()->>'role','') <> 'service_role' THEN
    NEW.client_id := auth.uid();
    NEW.status := 'new';
    NEW.completed_at := NULL;
    NEW.delivery_link := NULL;
  END IF;
  NEW.created_at := now();
  NEW.updated_at := now();
  RETURN NEW;
END; $$;
CREATE TRIGGER design_requests_bi BEFORE INSERT ON public.design_requests
  FOR EACH ROW EXECUTE FUNCTION public.design_requests_before_insert();

CREATE OR REPLACE FUNCTION public.design_requests_before_update()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at := now();
  NEW.created_at := OLD.created_at;
  IF NEW.status = 'completed' AND OLD.status <> 'completed' THEN NEW.completed_at := now();
  ELSIF NEW.status <> 'completed' THEN NEW.completed_at := NULL; END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER design_requests_bu BEFORE UPDATE ON public.design_requests
  FOR EACH ROW EXECUTE FUNCTION public.design_requests_before_update();

-- Status history
CREATE TABLE public.request_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES public.design_requests(id) ON DELETE CASCADE,
  from_status public.request_status,
  to_status public.request_status NOT NULL,
  changed_by uuid,
  changed_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX rsh_request_idx ON public.request_status_history(request_id, changed_at);
GRANT SELECT ON public.request_status_history TO authenticated;
GRANT ALL ON public.request_status_history TO service_role;
ALTER TABLE public.request_status_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own request history or admin" ON public.request_status_history FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR EXISTS (
    SELECT 1 FROM public.design_requests r WHERE r.id = request_id AND r.client_id = auth.uid()));

CREATE OR REPLACE FUNCTION public.log_request_status()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.request_status_history(request_id, from_status, to_status, changed_by)
    VALUES (NEW.id, NULL, NEW.status, auth.uid());
  ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.request_status_history(request_id, from_status, to_status, changed_by)
    VALUES (NEW.id, OLD.status, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER design_requests_status_log AFTER INSERT OR UPDATE ON public.design_requests
  FOR EACH ROW EXECUTE FUNCTION public.log_request_status();

-- Internal notes (admin only)
CREATE TABLE public.request_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES public.design_requests(id) ON DELETE CASCADE,
  author_id uuid NOT NULL DEFAULT auth.uid(),
  body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 5000),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX request_notes_request_idx ON public.request_notes(request_id, created_at);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.request_notes TO authenticated;
GRANT ALL ON public.request_notes TO service_role;
ALTER TABLE public.request_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin manages notes" ON public.request_notes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin') AND author_id = auth.uid());

-- Contact submissions
CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  email text NOT NULL CHECK (char_length(email) <= 255 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone text CHECK (char_length(phone) <= 30),
  message text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 1000),
  status public.contact_status NOT NULL DEFAULT 'new',
  private_notes text CHECK (char_length(private_notes) <= 5000),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX contact_status_idx ON public.contact_submissions(status, created_at DESC);
GRANT INSERT ON public.contact_submissions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_submissions TO authenticated;
GRANT ALL ON public.contact_submissions TO service_role;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can send contact message" ON public.contact_submissions FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'new' AND private_notes IS NULL);
CREATE POLICY "Admin reads contacts" ON public.contact_submissions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admin updates contacts" ON public.contact_submissions FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admin deletes contacts" ON public.contact_submissions FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER contact_touch BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Blog
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' AND char_length(slug) <= 120),
  excerpt text CHECK (char_length(excerpt) <= 500),
  content text NOT NULL DEFAULT '' CHECK (char_length(content) <= 100000),
  featured_image_url text CHECK (char_length(featured_image_url) <= 1000),
  seo_title text CHECK (char_length(seo_title) <= 70),
  seo_description text CHECK (char_length(seo_description) <= 170),
  published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  author_id uuid DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX blog_published_idx ON public.blog_posts(published, published_at DESC);
GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published posts" ON public.blog_posts FOR SELECT TO anon, authenticated
  USING (published OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admin inserts posts" ON public.blog_posts FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admin updates posts" ON public.blog_posts FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admin deletes posts" ON public.blog_posts FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));
CREATE OR REPLACE FUNCTION public.blog_before_write()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at := now();
  IF NEW.published AND NEW.published_at IS NULL THEN NEW.published_at := now(); END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER blog_bw BEFORE INSERT OR UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.blog_before_write();

-- New user: profile, client role, verified-email admin, link guest requests
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles(id, email, full_name)
  VALUES (NEW.id, NEW.email, left(NEW.raw_user_meta_data->>'full_name', 100))
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles(user_id, role) VALUES (NEW.id, 'client') ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;

CREATE OR REPLACE FUNCTION public.handle_user_confirmed()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL THEN
    IF lower(NEW.email) = 'dhiman@designbakerybd.com' THEN
      INSERT INTO public.user_roles(user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
    END IF;
    UPDATE public.design_requests SET client_id = NEW.id
      WHERE client_id IS NULL AND lower(email) = lower(NEW.email);
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
CREATE TRIGGER on_auth_user_created_confirmed AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_confirmed();
CREATE TRIGGER on_auth_user_confirmed AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
  EXECUTE FUNCTION public.handle_user_confirmed();

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_user_confirmed() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_request_status() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.design_requests_before_insert() FROM PUBLIC, anon, authenticated;

-- Storage: design references readable by admin and the owning client
CREATE POLICY "Admin reads design references" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'design-references' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Owner reads own design references" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'design-references' AND EXISTS (
    SELECT 1 FROM public.design_requests r WHERE r.reference_image_url = storage.objects.name AND r.client_id = auth.uid()));
CREATE POLICY "Admin deletes design references" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'design-references' AND public.has_role(auth.uid(),'admin'));

-- Storage: blog images (public read via public bucket, admin write)
CREATE POLICY "Admin uploads blog images" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'blog-images' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admin updates blog images" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'blog-images' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admin deletes blog images" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'blog-images' AND public.has_role(auth.uid(),'admin'));
