-- =====================================================
-- SETUP ROLE PERMISSIONS
-- Define what each role can do on each resource
-- =====================================================

-- Create role_permissions table if it doesn't exist
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role TEXT NOT NULL,
  resource TEXT NOT NULL,
  can_view BOOLEAN DEFAULT false,
  can_create BOOLEAN DEFAULT false,
  can_edit BOOLEAN DEFAULT false,
  can_delete BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(role, resource)
);

-- Delete existing permissions to start fresh
DELETE FROM role_permissions;

-- =====================================================
-- VIEWER ROLE (Read-only access)
-- Can only view content, cannot modify anything
-- =====================================================
INSERT INTO role_permissions (role, resource, can_view, can_create, can_edit, can_delete) VALUES
  ('viewer', 'inquiries', true, false, false, false),
  ('viewer', 'gallery', true, false, false, false),
  ('viewer', 'events', true, false, false, false),
  ('viewer', 'newsletter', true, false, false, false),
  ('viewer', 'testimonials', true, false, false, false),
  ('viewer', 'footer', true, false, false, false),
  ('viewer', 'users', false, false, false, false);  -- No access to users

-- =====================================================
-- EDITOR ROLE (Can edit existing content)
-- Can view and edit content, but cannot create or delete
-- Cannot access user management
-- =====================================================
INSERT INTO role_permissions (role, resource, can_view, can_create, can_edit, can_delete) VALUES
  ('editor', 'inquiries', true, false, true, false),
  ('editor', 'gallery', true, false, true, false),
  ('editor', 'events', true, false, true, false),
  ('editor', 'newsletter', true, false, false, false),  -- Can view but not delete signups
  ('editor', 'testimonials', true, false, true, false),
  ('editor', 'footer', true, false, true, false),
  ('editor', 'users', false, false, false, false);  -- No access to users

-- =====================================================
-- ADMIN ROLE (Full content management)
-- Can view, create, edit, and delete all content
-- Cannot manage users (only super_admin can)
-- =====================================================
INSERT INTO role_permissions (role, resource, can_view, can_create, can_edit, can_delete) VALUES
  ('admin', 'inquiries', true, true, true, true),
  ('admin', 'gallery', true, true, true, true),
  ('admin', 'events', true, true, true, true),
  ('admin', 'newsletter', true, false, true, true),  -- Can view and delete, but not create (users sign up)
  ('admin', 'testimonials', true, true, true, true),
  ('admin', 'footer', true, true, true, true),
  ('admin', 'users', false, false, false, false);  -- No access to users

-- Super admins get all permissions through code (see lib/auth.ts)
-- No need to insert rows for super_admin

-- Disable RLS on this table so authenticated users can read their permissions
ALTER TABLE role_permissions DISABLE ROW LEVEL SECURITY;

SELECT 'Role permissions configured successfully!' as status;
SELECT 'Permissions set for: viewer, editor, admin' as roles;
SELECT 'Super admins have full access to everything (including users)' as note;
