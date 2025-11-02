-- =====================================================
-- DISABLE RLS FOR SINGLE ADMIN SYSTEM
-- Since we removed Supabase Auth and use localStorage,
-- we need to disable RLS to allow data access
-- =====================================================

-- Disable RLS on all tables
ALTER TABLE IF EXISTS inquiries DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS events DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS gallery_images DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS testimonials DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS newsletter_signups DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS footer_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS experiences DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS admin_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS role_permissions DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies to prevent conflicts
DROP POLICY IF EXISTS "Allow authenticated users to view admin profiles" ON admin_profiles;
DROP POLICY IF EXISTS "Allow super admins to create admin profiles" ON admin_profiles;
DROP POLICY IF EXISTS "Allow super admins to update admin profiles" ON admin_profiles;
DROP POLICY IF EXISTS "Allow super admins to delete admin profiles" ON admin_profiles;

DROP POLICY IF EXISTS "Allow public read access to events" ON events;
DROP POLICY IF EXISTS "Allow authenticated users to manage events" ON events;

DROP POLICY IF EXISTS "Allow public read access to gallery" ON gallery_images;
DROP POLICY IF EXISTS "Allow authenticated users to manage gallery" ON gallery_images;

DROP POLICY IF EXISTS "Allow public read access to testimonials" ON testimonials;
DROP POLICY IF EXISTS "Allow authenticated users to manage testimonials" ON testimonials;

DROP POLICY IF EXISTS "Allow authenticated users to view inquiries" ON inquiries;
DROP POLICY IF EXISTS "Allow authenticated users to manage inquiries" ON inquiries;

DROP POLICY IF EXISTS "Allow public to signup for newsletter" ON newsletter_signups;
DROP POLICY IF EXISTS "Allow authenticated users to manage newsletter" ON newsletter_signups;

DROP POLICY IF EXISTS "Allow public read access to footer settings" ON footer_settings;
DROP POLICY IF EXISTS "Allow authenticated users to manage footer settings" ON footer_settings;

DROP POLICY IF EXISTS "Allow public read access to experiences" ON experiences;
DROP POLICY IF EXISTS "Allow authenticated users to manage experiences" ON experiences;

SELECT 'RLS disabled on all tables' as status;
SELECT 'All policies dropped' as note;
SELECT 'Data is now accessible without authentication' as warning;
