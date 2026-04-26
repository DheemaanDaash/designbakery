-- Create public bucket for brand assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('brand-assets', 'brand-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Public read access
CREATE POLICY "Public read access for brand-assets"
ON storage.objects
FOR SELECT
USING (bucket_id = 'brand-assets');