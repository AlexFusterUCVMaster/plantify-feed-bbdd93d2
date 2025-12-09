-- Drop existing upload policy and create a new one that allows authenticated users to upload to their own folder
DROP POLICY IF EXISTS "Authenticated users can upload plant images" ON storage.objects;

CREATE POLICY "Users can upload to their own folder"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'plant-images' 
  AND auth.uid() IS NOT NULL 
  AND (storage.foldername(name))[1] = auth.uid()::text
);