-- =====================================================
-- SUNSET HAVEN RESORT - SUPABASE AUTH INTEGRATION
-- Run this ONCE in your Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. ADMIN USER PROFILES (links to Supabase Auth)
-- =====================================================

CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('super_admin', 'admin', 'editor', 'viewer')),
  is_active BOOLEAN DEFAULT true,
  is_deletable BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. ROLE PERMISSIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'editor', 'viewer')),
  resource TEXT NOT NULL,
  can_view BOOLEAN DEFAULT false,
  can_create BOOLEAN DEFAULT false,
  can_edit BOOLEAN DEFAULT false,
  can_delete BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(role, resource)
);

-- =====================================================
-- 3. EXISTING TABLES (ensure they exist)
-- =====================================================

CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  caption TEXT,
  show_in_hero BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date DATE NOT NULL,
  cost NUMERIC(10, 2) DEFAULT 0,
  pricing_tiers JSONB DEFAULT '[]'::jsonb,
  flier_url TEXT,
  paystack_payment_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_newsletter_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS footer_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instagram_url TEXT,
  x_url TEXT,
  facebook_url TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

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
-- 4. ROW LEVEL SECURITY POLICIES
-- =====================================================

ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_newsletter_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access" ON gallery_images;
DROP POLICY IF EXISTS "Public read access" ON events;
DROP POLICY IF EXISTS "Public read access" ON testimonials;
DROP POLICY IF EXISTS "Public read access" ON footer_settings;
DROP POLICY IF EXISTS "Public insert access" ON inquiries;
DROP POLICY IF EXISTS "Public insert access" ON event_newsletter_signups;
DROP POLICY IF EXISTS "Admin full access" ON gallery_images;
DROP POLICY IF EXISTS "Admin full access" ON events;
DROP POLICY IF EXISTS "Admin full access" ON testimonials;
DROP POLICY IF EXISTS "Admin full access" ON footer_settings;
DROP POLICY IF EXISTS "Admin full access" ON inquiries;
DROP POLICY IF EXISTS "Admin full access" ON event_newsletter_signups;
DROP POLICY IF EXISTS "Admin read access" ON admin_profiles;
DROP POLICY IF EXISTS "Admin update own profile" ON admin_profiles;
DROP POLICY IF EXISTS "Super admin full access" ON admin_profiles;
DROP POLICY IF EXISTS "Public read access" ON role_permissions;

-- Public access policies (for frontend)
CREATE POLICY "Public read access" ON gallery_images FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON events FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON footer_settings FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON event_newsletter_signups FOR INSERT WITH CHECK (true);

-- Admin access policies (authenticated users with admin_profiles)
CREATE POLICY "Admin full access" ON gallery_images FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE admin_profiles.id = auth.uid()
    AND admin_profiles.is_active = true
  )
);

CREATE POLICY "Admin full access" ON events FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE admin_profiles.id = auth.uid()
    AND admin_profiles.is_active = true
  )
);

CREATE POLICY "Admin full access" ON testimonials FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE admin_profiles.id = auth.uid()
    AND admin_profiles.is_active = true
  )
);

CREATE POLICY "Admin full access" ON footer_settings FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE admin_profiles.id = auth.uid()
    AND admin_profiles.is_active = true
  )
);

CREATE POLICY "Admin full access" ON inquiries FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE admin_profiles.id = auth.uid()
    AND admin_profiles.is_active = true
  )
);

CREATE POLICY "Admin full access" ON event_newsletter_signups FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE admin_profiles.id = auth.uid()
    AND admin_profiles.is_active = true
  )
);

-- Admin profiles policies
CREATE POLICY "Admin read access" ON admin_profiles FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM admin_profiles ap
    WHERE ap.id = auth.uid()
    AND ap.is_active = true
  )
);

CREATE POLICY "Admin update own profile" ON admin_profiles FOR UPDATE USING (
  id = auth.uid()
);

CREATE POLICY "Super admin full access" ON admin_profiles FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE admin_profiles.id = auth.uid()
    AND admin_profiles.role = 'super_admin'
    AND admin_profiles.is_active = true
  )
);

-- Role permissions - readable by all authenticated admins
CREATE POLICY "Public read access" ON role_permissions FOR SELECT USING (true);

-- =====================================================
-- 5. FUNCTIONS
-- =====================================================

-- Function to auto-create admin profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.admin_profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'viewer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_admin_user();

-- Function to check user permissions
CREATE OR REPLACE FUNCTION public.has_permission(
  user_id UUID,
  resource_name TEXT,
  permission_type TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
  has_perm BOOLEAN;
BEGIN
  -- Get user role
  SELECT role INTO user_role
  FROM admin_profiles
  WHERE id = user_id AND is_active = true;

  IF user_role IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Super admin has all permissions
  IF user_role = 'super_admin' THEN
    RETURN TRUE;
  END IF;

  -- Check specific permission
  CASE permission_type
    WHEN 'view' THEN
      SELECT can_view INTO has_perm
      FROM role_permissions
      WHERE role = user_role AND resource = resource_name;
    WHEN 'create' THEN
      SELECT can_create INTO has_perm
      FROM role_permissions
      WHERE role = user_role AND resource = resource_name;
    WHEN 'edit' THEN
      SELECT can_edit INTO has_perm
      FROM role_permissions
      WHERE role = user_role AND resource = resource_name;
    WHEN 'delete' THEN
      SELECT can_delete INTO has_perm
      FROM role_permissions
      WHERE role = user_role AND resource = resource_name;
    ELSE
      RETURN FALSE;
  END CASE;

  RETURN COALESCE(has_perm, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 6. DEFAULT ROLE PERMISSIONS
-- =====================================================

-- Super Admin (full access)
INSERT INTO role_permissions (role, resource, can_view, can_create, can_edit, can_delete) VALUES
('super_admin', 'inquiries', true, true, true, true),
('super_admin', 'gallery', true, true, true, true),
('super_admin', 'events', true, true, true, true),
('super_admin', 'newsletter', true, true, true, true),
('super_admin', 'testimonials', true, true, true, true),
('super_admin', 'footer', true, true, true, true),
('super_admin', 'users', true, true, true, true)
ON CONFLICT (role, resource) DO UPDATE SET
  can_view = EXCLUDED.can_view,
  can_create = EXCLUDED.can_create,
  can_edit = EXCLUDED.can_edit,
  can_delete = EXCLUDED.can_delete;

-- Admin (all except user management)
INSERT INTO role_permissions (role, resource, can_view, can_create, can_edit, can_delete) VALUES
('admin', 'inquiries', true, true, true, true),
('admin', 'gallery', true, true, true, true),
('admin', 'events', true, true, true, true),
('admin', 'newsletter', true, true, true, true),
('admin', 'testimonials', true, true, true, true),
('admin', 'footer', true, true, true, false),
('admin', 'users', true, false, false, false)
ON CONFLICT (role, resource) DO UPDATE SET
  can_view = EXCLUDED.can_view,
  can_create = EXCLUDED.can_create,
  can_edit = EXCLUDED.can_edit,
  can_delete = EXCLUDED.can_delete;

-- Editor (can edit content but not delete)
INSERT INTO role_permissions (role, resource, can_view, can_create, can_edit, can_delete) VALUES
('editor', 'inquiries', true, false, true, false),
('editor', 'gallery', true, true, true, false),
('editor', 'events', true, true, true, false),
('editor', 'newsletter', true, false, false, false),
('editor', 'testimonials', true, true, true, false),
('editor', 'footer', true, false, true, false),
('editor', 'users', false, false, false, false)
ON CONFLICT (role, resource) DO UPDATE SET
  can_view = EXCLUDED.can_view,
  can_create = EXCLUDED.can_create,
  can_edit = EXCLUDED.can_edit,
  can_delete = EXCLUDED.can_delete;

-- Viewer (read-only)
INSERT INTO role_permissions (role, resource, can_view, can_create, can_edit, can_delete) VALUES
('viewer', 'inquiries', true, false, false, false),
('viewer', 'gallery', true, false, false, false),
('viewer', 'events', true, false, false, false),
('viewer', 'newsletter', true, false, false, false),
('viewer', 'testimonials', true, false, false, false),
('viewer', 'footer', true, false, false, false),
('viewer', 'users', false, false, false, false)
ON CONFLICT (role, resource) DO UPDATE SET
  can_view = EXCLUDED.can_view,
  can_create = EXCLUDED.can_create,
  can_edit = EXCLUDED.can_edit,
  can_delete = EXCLUDED.can_delete;

-- =====================================================
-- 7. INSERT DEFAULT FOOTER SETTINGS (only if table is empty)
-- =====================================================

-- Only insert if footer_settings is completely empty
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM footer_settings LIMIT 1) THEN
    -- Check which column exists (x_url or twitter_url) and insert accordingly
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'footer_settings' AND column_name = 'x_url'
    ) THEN
      INSERT INTO footer_settings (instagram_url, x_url, facebook_url, email, phone, address)
      VALUES (
        'https://instagram.com/sunsethaven',
        'https://x.com/sunsethaven',
        'https://facebook.com/sunsethaven',
        'hello@sunsethaven.com',
        '+234 XXX XXX XXXX',
        'Tarkwa Bay Island, Lagos, Nigeria'
      );
      RAISE NOTICE 'Inserted default footer settings with x_url';
    ELSIF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'footer_settings' AND column_name = 'twitter_url'
    ) THEN
      INSERT INTO footer_settings (instagram_url, twitter_url, facebook_url, email, phone, address)
      VALUES (
        'https://instagram.com/sunsethaven',
        'https://twitter.com/sunsethaven',
        'https://facebook.com/sunsethaven',
        'hello@sunsethaven.com',
        '+234 XXX XXX XXXX',
        'Tarkwa Bay Island, Lagos, Nigeria'
      );
      RAISE NOTICE 'Inserted default footer settings with twitter_url';
    END IF;
  ELSE
    RAISE NOTICE 'Footer settings already exist, skipping insert';
  END IF;
END $$;

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================

SELECT
  'Database setup completed successfully!' as message,
  'Next: Create your super admin user via Supabase Dashboard' as step_1,
  'Go to Authentication > Users > Invite user' as step_2,
  'After creating, run: UPDATE admin_profiles SET role = ''super_admin'', is_deletable = false WHERE email = ''your-email@example.com'';' as step_3;
