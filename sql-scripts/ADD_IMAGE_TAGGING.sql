-- =====================================================
-- ADD IMAGE TAGGING SYSTEM
-- Allow images to be tagged to specific activities
-- And control where they display (Hero, Gallery, Activities)
-- =====================================================

-- Add new columns to gallery_images table
ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS tag TEXT;
ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS activity_id UUID;
ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS show_in_gallery BOOLEAN DEFAULT true;

-- Add foreign key constraint only if experiences table exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'experiences'
    ) THEN
        -- Add foreign key constraint
        ALTER TABLE gallery_images
        ADD CONSTRAINT fk_gallery_images_activity
        FOREIGN KEY (activity_id)
        REFERENCES experiences(id)
        ON DELETE SET NULL;
    END IF;
END $$;

-- Update existing records to have show_in_gallery = true
UPDATE gallery_images SET show_in_gallery = true WHERE show_in_gallery IS NULL;

-- Rename category column to tag if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'gallery_images' AND column_name = 'category'
    ) THEN
        -- Copy category to tag
        UPDATE gallery_images SET tag = category WHERE tag IS NULL;
        -- Optionally drop category column (commented out for safety)
        -- ALTER TABLE gallery_images DROP COLUMN category;
    END IF;
END $$;

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_gallery_images_activity ON gallery_images(activity_id);
CREATE INDEX IF NOT EXISTS idx_gallery_images_tag ON gallery_images(tag);

SELECT 'Image tagging system added!' as message;
SELECT 'Columns added: tag, activity_id, show_in_gallery' as details;
SELECT 'You can now refresh the gallery admin page!' as next_step;
