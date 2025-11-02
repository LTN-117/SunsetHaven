-- =====================================================
-- CREATE NEWSLETTER TABLE
-- Creates the event_newsletter_signups table with correct structure
-- =====================================================

-- Drop table if exists (CAUTION: This will delete all data)
-- Uncomment the next line only if you want to recreate the table
-- DROP TABLE IF EXISTS event_newsletter_signups CASCADE;

-- Create the table
CREATE TABLE IF NOT EXISTS event_newsletter_signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  event_id UUID,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON event_newsletter_signups(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_event ON event_newsletter_signups(event_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_created ON event_newsletter_signups(created_at DESC);

-- Disable RLS for admin access
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

SELECT 'Newsletter table created successfully!' as status;
SELECT 'RLS is disabled - admins can access all records' as rls_status;
SELECT 'You can now refresh the newsletter admin page!' as next_step;
