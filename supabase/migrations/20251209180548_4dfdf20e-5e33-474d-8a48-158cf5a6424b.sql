-- Create storage bucket for plant images
INSERT INTO storage.buckets (id, name, public)
VALUES ('plant-images', 'plant-images', true);

-- Allow public read access to plant images
CREATE POLICY "Plant images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'plant-images');

-- Allow authenticated users to upload plant images
CREATE POLICY "Authenticated users can upload plant images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'plant-images' AND auth.uid() IS NOT NULL);

-- Allow users to update their own uploads
CREATE POLICY "Users can update their own plant images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'plant-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete their own plant images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'plant-images' AND auth.uid()::text = (storage.foldername(name))[1]);