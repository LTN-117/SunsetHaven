-- =====================================================
-- ADD MISSING COLUMNS TO NEWSLETTER TABLE
-- Adds created_at, updated_at, and event_id columns
-- =====================================================

-- Add missing columns
ALTER TABLE event_newsletter_signups
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;

ALTER TABLE event_newsletter_signups
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;

ALTER TABLE event_newsletter_signups
ADD COLUMN IF NOT EXISTS event_id UUID;

-- Update existing rows to have created_at = subscribed_at
UPDATE event_newsletter_signups
SET created_at = subscribed_at
WHERE created_at IS NULL;

UPDATE event_newsletter_signups
SET updated_at = subscribed_at
WHERE updated_at IS NULL;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON event_newsletter_signups(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_event ON event_newsletter_signups(event_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_created ON event_newsletter_signups(created_at DESC);

-- Make sure RLS is disabled
ALTER TABLE event_newsletter_signups DISABLE ROW LEVEL SECURITY;

-- Create update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_newsletter_updated_at ON event_newsletter_signups;
CREATE TRIGGER update_newsletter_updated_at
  BEFORE UPDATE ON event_newsletter_signups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

SELECT 'Missing columns added successfully!' as status;
SELECT 'Columns added: created_at, updated_at, event_id' as details;
SELECT 'Newsletter page should now work - refresh it!' as next_step;
