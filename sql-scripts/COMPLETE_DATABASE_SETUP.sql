-- =====================================================
-- SUNSET HAVEN RESORT - COMPLETE DATABASE SETUP
-- Run this ONCE in your Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. ADMIN USERS & ROLES TABLES
-- =====================================================

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('super_admin', 'admin', 'editor', 'viewer')),
  is_active BOOLEAN DEFAULT true,
  is_deletable BOOLEAN DEFAULT true, -- Super admin account will be false
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Role permissions table
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'editor', 'viewer')),
  resource TEXT NOT NULL, -- 'inquiries', 'gallery', 'events', 'newsletter', 'testimonials', 'footer', 'users'
  can_view BOOLEAN DEFAULT false,
  can_create BOOLEAN DEFAULT false,
  can_edit BOOLEAN DEFAULT false,
  can_delete BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(role, resource)
);

-- =====================================================
-- 2. EXISTING TABLES (from database-updates.sql)
-- =====================================================

-- Gallery images table
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  caption TEXT,
  show_in_hero BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date DATE NOT NULL,
  cost NUMERIC(10, 2) DEFAULT 0,
  flier_url TEXT,
  paystack_payment_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event newsletter signups table
CREATE TABLE IF NOT EXISTS event_newsletter_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Footer settings table
CREATE TABLE IF NOT EXISTS footer_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instagram_url TEXT,
  twitter_url TEXT,
  facebook_url TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  inquiry_type TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. ADD PRICING TIERS TO EVENTS (from event-pricing-update.sql)
-- =====================================================

ALTER TABLE events
ADD COLUMN IF NOT EXISTS pricing_tiers JSONB DEFAULT '[]'::jsonb;

-- =====================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_newsletter_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- Public read access for frontend
CREATE POLICY "Enable read access for all users" ON gallery_images FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON events FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON footer_settings FOR SELECT USING (true);

-- Public insert for inquiries and newsletter
CREATE POLICY "Enable insert for all users" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all users" ON event_newsletter_signups FOR INSERT WITH CHECK (true);

-- Admin read access
CREATE POLICY "Enable read for authenticated users" ON inquiries FOR SELECT USING (true);
CREATE POLICY "Enable read for authenticated users" ON event_newsletter_signups FOR SELECT USING (true);
CREATE POLICY "Enable read for authenticated users" ON admin_users FOR SELECT USING (true);
CREATE POLICY "Enable read for authenticated users" ON role_permissions FOR SELECT USING (true);

-- Admin write access (you'll implement proper auth later)
CREATE POLICY "Enable all operations for service role" ON gallery_images FOR ALL USING (true);
CREATE POLICY "Enable all operations for service role" ON events FOR ALL USING (true);
CREATE POLICY "Enable all operations for service role" ON testimonials FOR ALL USING (true);
CREATE POLICY "Enable all operations for service role" ON footer_settings FOR ALL USING (true);
CREATE POLICY "Enable all operations for service role" ON inquiries FOR ALL USING (true);
CREATE POLICY "Enable all operations for service role" ON event_newsletter_signups FOR ALL USING (true);
CREATE POLICY "Enable all operations for service role" ON admin_users FOR ALL USING (true);
CREATE POLICY "Enable all operations for service role" ON role_permissions FOR ALL USING (true);

-- =====================================================
-- 5. DEFAULT DATA - ROLE PERMISSIONS
-- =====================================================

-- Super Admin (full access to everything)
INSERT INTO role_permissions (role, resource, can_view, can_create, can_edit, can_delete) VALUES
('super_admin', 'inquiries', true, true, true, true),
('super_admin', 'gallery', true, true, true, true),
('super_admin', 'events', true, true, true, true),
('super_admin', 'newsletter', true, true, true, true),
('super_admin', 'testimonials', true, true, true, true),
('super_admin', 'footer', true, true, true, true),
('super_admin', 'users', true, true, true, true)
ON CONFLICT (role, resource) DO NOTHING;

-- Admin (all access except user management)
INSERT INTO role_permissions (role, resource, can_view, can_create, can_edit, can_delete) VALUES
('admin', 'inquiries', true, true, true, true),
('admin', 'gallery', true, true, true, true),
('admin', 'events', true, true, true, true),
('admin', 'newsletter', true, true, true, true),
('admin', 'testimonials', true, true, true, true),
('admin', 'footer', true, true, true, false),
('admin', 'users', true, false, false, false)
ON CONFLICT (role, resource) DO NOTHING;

-- Editor (can edit content but not delete)
INSERT INTO role_permissions (role, resource, can_view, can_create, can_edit, can_delete) VALUES
('editor', 'inquiries', true, false, true, false),
('editor', 'gallery', true, true, true, false),
('editor', 'events', true, true, true, false),
('editor', 'newsletter', true, false, false, false),
('editor', 'testimonials', true, true, true, false),
('editor', 'footer', true, false, true, false),
('editor', 'users', false, false, false, false)
ON CONFLICT (role, resource) DO NOTHING;

-- Viewer (read-only access)
INSERT INTO role_permissions (role, resource, can_view, can_create, can_edit, can_delete) VALUES
('viewer', 'inquiries', true, false, false, false),
('viewer', 'gallery', true, false, false, false),
('viewer', 'events', true, false, false, false),
('viewer', 'newsletter', true, false, false, false),
('viewer', 'testimonials', true, false, false, false),
('viewer', 'footer', true, false, false, false),
('viewer', 'users', false, false, false, false)
ON CONFLICT (role, resource) DO NOTHING;

-- =====================================================
-- 6. CREATE SUPER ADMIN ACCOUNT
-- =====================================================

-- IMPORTANT: Change this password immediately!
-- Default credentials: admin@sunsethaven.com / ChangeMe123!
-- Password hash for "ChangeMe123!" (you'll need to hash this properly in production)

INSERT INTO admin_users (
  email,
  full_name,
  password_hash,
  role,
  is_active,
  is_deletable
) VALUES (
  'admin@sunsethaven.com',
  'Super Administrator',
  '$2a$10$rBV2Mz3qF.4E8ZxFMPz3xuGKYQJQ1P5zGhxJKQZxZxZxZxZxZxZxZ', -- PLACEHOLDER - implement proper auth
  'super_admin',
  true,
  false -- Cannot be deleted
) ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- 7. SAMPLE FOOTER SETTINGS (if doesn't exist)
-- =====================================================

INSERT INTO footer_settings (
  instagram_url,
  twitter_url,
  facebook_url,
  email,
  phone,
  address
)
SELECT
  'https://instagram.com/sunsethaven',
  'https://twitter.com/sunsethaven',
  'https://facebook.com/sunsethaven',
  'hello@sunsethaven.com',
  '+234 XXX XXX XXXX',
  'Tarkwa Bay Island, Lagos, Nigeria'
WHERE NOT EXISTS (SELECT 1 FROM footer_settings);

-- =====================================================
-- 8. USEFUL VIEWS FOR REPORTING
-- =====================================================

-- View for newsletter signups by date
CREATE OR REPLACE VIEW newsletter_signups_by_date AS
SELECT
  DATE(created_at) as signup_date,
  COUNT(*) as signups
FROM event_newsletter_signups
GROUP BY DATE(created_at)
ORDER BY signup_date DESC;

-- View for inquiry statistics
CREATE OR REPLACE VIEW inquiry_stats AS
SELECT
  status,
  inquiry_type,
  COUNT(*) as count
FROM inquiries
GROUP BY status, inquiry_type;

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================

SELECT 'Database setup completed successfully!' as message,
       'Default super admin: admin@sunsethaven.com' as note,
       'IMPORTANT: Implement proper authentication before production!' as warning;
