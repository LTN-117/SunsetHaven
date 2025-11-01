-- =====================================================
-- FIX: Rename twitter_url to x_url in footer_settings
-- Run this FIRST before running SUPABASE_AUTH_SETUP.sql
-- =====================================================

-- Check if twitter_url column exists and rename it to x_url
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'footer_settings'
        AND column_name = 'twitter_url'
    ) THEN
        ALTER TABLE footer_settings RENAME COLUMN twitter_url TO x_url;
        RAISE NOTICE 'Successfully renamed twitter_url to x_url';
    ELSE
        RAISE NOTICE 'Column twitter_url does not exist, skipping rename';
    END IF;
END $$;

-- Update any existing data to use x.com instead of twitter.com
UPDATE footer_settings
SET x_url = REPLACE(x_url, 'twitter.com', 'x.com')
WHERE x_url LIKE '%twitter.com%';

SELECT 'Footer settings migration completed!' as message;
