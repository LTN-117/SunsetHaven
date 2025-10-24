-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Inquiries Table
CREATE TABLE inquiries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  inquiry_type TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Gallery Images Table
CREATE TABLE gallery_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT DEFAULT '',
  category TEXT DEFAULT 'general',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Testimonials Table
CREATE TABLE testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  guest_name TEXT NOT NULL,
  quote TEXT NOT NULL,
  guest_role TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Footer Settings Table (Single Row)
CREATE TABLE footer_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT DEFAULT 'tarkwabaylifestyle@gmail.com',
  phone TEXT DEFAULT '+234 806 935 9028',
  address TEXT DEFAULT 'Tarkwa Bay Island, Lagos',
  additional_info TEXT DEFAULT '15 minutes by boat from Lagos',
  instagram_handle TEXT DEFAULT '@sunset.haven__',
  instagram_url TEXT DEFAULT 'https://instagram.com/sunset.haven__',
  availability_text TEXT DEFAULT 'Year-round availability',
  transport_text TEXT DEFAULT 'Boat transport available',
  copyright_text TEXT DEFAULT '© 2025 by Sunset Haven. Powered and secured by Vercel.',
  powered_by_text TEXT DEFAULT 'Powered and secured by Vercel',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Insert default footer settings
INSERT INTO footer_settings (id) VALUES (uuid_generate_v4());

-- Create indexes for better performance
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_created_at ON inquiries(created_at DESC);
CREATE INDEX idx_gallery_display_order ON gallery_images(display_order);
CREATE INDEX idx_gallery_is_active ON gallery_images(is_active);
CREATE INDEX idx_testimonials_display_order ON testimonials(display_order);
CREATE INDEX idx_testimonials_is_active ON testimonials(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_settings ENABLE ROW LEVEL SECURITY;

-- Create policies (Allow all for now - update with proper auth later)
CREATE POLICY "Enable read access for all users" ON inquiries FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON inquiries FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON gallery_images FOR SELECT USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON gallery_images FOR ALL USING (true);

CREATE POLICY "Enable read access for all users" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON testimonials FOR ALL USING (true);

CREATE POLICY "Enable read access for all users" ON footer_settings FOR SELECT USING (true);
CREATE POLICY "Enable update for authenticated users" ON footer_settings FOR UPDATE USING (true);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers
CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON inquiries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_footer_settings_updated_at BEFORE UPDATE ON footer_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
