
CREATE TABLE public.design_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  request_name TEXT NOT NULL,
  design_type TEXT NOT NULL,
  dimension TEXT NOT NULL,
  custom_width TEXT,
  custom_height TEXT,
  reference_link TEXT,
  reference_image_url TEXT,
  design_content TEXT NOT NULL,
  deadline DATE NOT NULL,
  email TEXT NOT NULL
);
GRANT INSERT ON public.design_requests TO anon, authenticated;
GRANT ALL ON public.design_requests TO service_role;
ALTER TABLE public.design_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit design requests" ON public.design_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
