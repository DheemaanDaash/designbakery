CREATE POLICY "Admin uploads blog images to brand-assets" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'brand-assets' AND (storage.foldername(name))[1] = 'blog' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admin updates blog images in brand-assets" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'brand-assets' AND (storage.foldername(name))[1] = 'blog' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admin deletes blog images in brand-assets" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'brand-assets' AND (storage.foldername(name))[1] = 'blog' AND public.has_role(auth.uid(),'admin'));