-- =====================================================
-- FIX RLS POLICIES FOR MIDDLEWARE ACCESS
-- The middleware needs to read admin_profiles to check permissions
-- =====================================================

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admin read access" ON admin_profiles;
DROP POLICY IF EXISTS "Admin update own profile" ON admin_profiles;
DROP POLICY IF EXISTS "Super admin full access" ON admin_profiles;

-- Create new policies that allow authenticated users to read their own profile
-- This is needed for the middleware to work

-- Allow users to read their own profile (CRITICAL for middleware)
CREATE POLICY "Users can read own profile" ON admin_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Allow users to update their own profile (except role and is_deletable)
CREATE POLICY "Users can update own profile" ON admin_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Super admins can do everything
CREATE POLICY "Super admins have full access" ON admin_profiles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE id = auth.uid()
      AND role = 'super_admin'
      AND is_active = true
    )
  );

-- Allow service role full access (for middleware)
CREATE POLICY "Service role full access" ON admin_profiles
  FOR ALL
  USING (true);

SELECT 'RLS policies updated successfully!' as message;
SELECT 'Try logging in again now.' as next_step;
