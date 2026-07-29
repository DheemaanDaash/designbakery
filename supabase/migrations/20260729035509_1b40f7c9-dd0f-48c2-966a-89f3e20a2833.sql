
CREATE POLICY "Anyone can upload design references"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'design-references');
