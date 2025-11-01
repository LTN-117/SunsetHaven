-- =====================================================
-- DEBUG AUTHENTICATION ISSUES
-- Run this to see exactly what's wrong
-- =====================================================

-- 1. Check if your user exists in auth.users
SELECT
  'AUTH USER' as check_type,
  id,
  email,
  created_at
FROM auth.users
WHERE email = 'lighteningconsultancy@gmail.com';

-- 2. Check if admin profile exists
SELECT
  'ADMIN PROFILE' as check_type,
  id,
  email,
  full_name,
  role,
  is_active,
  is_deletable
FROM admin_profiles
WHERE email = 'lighteningconsultancy@gmail.com';

-- 3. Check ALL RLS policies on admin_profiles
SELECT
  'RLS POLICY' as check_type,
  policyname as policy_name,
  cmd as command,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'admin_profiles'
ORDER BY policyname;

-- 4. Test if you can read your own profile (simulating middleware)
-- This should return your profile if RLS is set up correctly
SELECT
  'PROFILE READ TEST' as check_type,
  id,
  email,
  full_name,
  role,
  is_active
FROM admin_profiles
WHERE email = 'lighteningconsultancy@gmail.com'
AND is_active = true;

SELECT '=== DIAGNOSTICS COMPLETE ===' as status;
