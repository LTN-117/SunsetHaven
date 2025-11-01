-- =====================================================
-- SETUP SUPABASE STORAGE FOR IMAGE UPLOADS
-- Run this in Supabase SQL Editor
-- =====================================================

-- Note: Storage buckets must be created via Supabase Dashboard
-- This script only sets up RLS policies

-- After running this, go to:
-- Storage > Create a new bucket > Name it "gallery-images" > Public bucket

-- RLS Policies for storage.objects
-- These allow authenticated users to upload/manage images

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'gallery-images');

-- Allow authenticated users to update images
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'gallery-images');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'gallery-images');

-- Allow public to view images (since it's a public bucket)
CREATE POLICY "Anyone can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'gallery-images');

SELECT 'Storage policies created! Now create the bucket in Supabase Dashboard.' as message;
