-- =====================================================
-- FIX INFINITE RECURSION IN RLS POLICIES
-- The self-referencing policy is causing recursion
-- =====================================================

-- Drop ALL existing policies on admin_profiles
DROP POLICY IF EXISTS "Users can read own profile" ON admin_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON admin_profiles;
DROP POLICY IF EXISTS "Super admins have full access" ON admin_profiles;
DROP POLICY IF EXISTS "Super admins full access" ON admin_profiles;
DROP POLICY IF EXISTS "Service role full access" ON admin_profiles;

-- Simple policy: Users can read and update their own profile
CREATE POLICY "Own profile access" ON admin_profiles
  FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Service role (used by middleware) has full access
-- This bypasses RLS when using service_role key
-- No policy needed as service_role bypasses RLS by default

SELECT 'RLS policies fixed - recursion removed!' as message;
SELECT 'Refresh your admin page now.' as next_step;
