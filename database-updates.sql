-- Database Updates for New Features
-- Run this in Supabase SQL Editor

-- 1. Add show_in_hero column to gallery_images
ALTER TABLE gallery_images
ADD COLUMN IF NOT EXISTS show_in_hero BOOLEAN DEFAULT false;

-- 2. Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date DATE NOT NULL,
  cost NUMERIC(10, 2) NOT NULL,
  flier_url TEXT NOT NULL,
  paystack_payment_url TEXT DEFAULT 'https://paystack.com',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create event_partners table
CREATE TABLE IF NOT EXISTS event_partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create event_newsletter_signups table
CREATE TABLE IF NOT EXISTS event_newsletter_signups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date DESC);
CREATE INDEX IF NOT EXISTS idx_events_active ON events(is_active);
CREATE INDEX IF NOT EXISTS idx_event_partners_event_id ON event_partners(event_id);
CREATE INDEX IF NOT EXISTS idx_gallery_show_in_hero ON gallery_images(show_in_hero);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_newsletter_signups ENABLE ROW LEVEL SECURITY;

-- RLS Policies (open for MVP - update with auth later)
CREATE POLICY "Enable read access for all users" ON events FOR SELECT USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON events FOR ALL USING (true);

CREATE POLICY "Enable read access for all users" ON event_partners FOR SELECT USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON event_partners FOR ALL USING (true);

CREATE POLICY "Enable insert for all users" ON event_newsletter_signups FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read for authenticated users" ON event_newsletter_signups FOR SELECT USING (true);

-- Add updated_at trigger for events
CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON events
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Success message
SELECT 'Database updates completed successfully!' as message;
