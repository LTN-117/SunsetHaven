-- =====================================================
-- FIX ADMIN USER DELETE PERMISSIONS
-- Allow super admins to delete users
-- =====================================================

-- Drop existing policies on admin_profiles
DROP POLICY IF EXISTS "Allow authenticated users to view admin profiles" ON admin_profiles;
DROP POLICY IF EXISTS "Allow users to view their own profile" ON admin_profiles;
DROP POLICY IF EXISTS "Allow super admins to manage all profiles" ON admin_profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON admin_profiles;

-- Recreate policies with proper permissions

-- 1. Allow all authenticated users to view admin profiles (needed for auth checks)
CREATE POLICY "Allow authenticated users to view admin profiles"
ON admin_profiles FOR SELECT
TO authenticated
USING (true);

-- 2. Allow super admins to INSERT new admin profiles
CREATE POLICY "Allow super admins to create admin profiles"
ON admin_profiles FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE id = auth.uid()
    AND role = 'super_admin'
    AND is_active = true
  )
);

-- 3. Allow super admins to UPDATE admin profiles
CREATE POLICY "Allow super admins to update admin profiles"
ON admin_profiles FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE id = auth.uid()
    AND role = 'super_admin'
    AND is_active = true
  )
);

-- 4. Allow super admins to DELETE admin profiles (except their own)
CREATE POLICY "Allow super admins to delete admin profiles"
ON admin_profiles FOR DELETE
TO authenticated
USING (
  -- Must be a super admin
  EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE id = auth.uid()
    AND role = 'super_admin'
    AND is_active = true
  )
  AND
  -- Cannot delete yourself
  id != auth.uid()
  AND
  -- Can only delete if user is deletable
  is_deletable = true
);

-- Verify RLS is enabled
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

SELECT 'Admin profiles RLS policies updated successfully!' as status;
SELECT 'Super admins can now delete users (except themselves)' as note;
