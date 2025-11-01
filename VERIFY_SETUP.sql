-- =====================================================
-- VERIFY YOUR SETUP IS CORRECT
-- Run this to check everything is working
-- =====================================================

-- 1. Check if your user exists in auth
SELECT
  'AUTH USER CHECK' as check_type,
  id,
  email,
  created_at,
  last_sign_in_at
FROM auth.users
WHERE email = 'lighteningconsultancy@gmail.com';

-- 2. Check if your admin profile exists
SELECT
  'ADMIN PROFILE CHECK' as check_type,
  id,
  email,
  full_name,
  role,
  is_active,
  is_deletable
FROM admin_profiles
WHERE email = 'lighteningconsultancy@gmail.com';

-- 3. Check RLS policies on admin_profiles
SELECT
  'RLS POLICIES CHECK' as check_type,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'admin_profiles';

-- 4. Test if you can read your own profile (simulating what middleware does)
SELECT
  'PROFILE READ TEST' as check_type,
  *
FROM admin_profiles
WHERE email = 'lighteningconsultancy@gmail.com';

SELECT '=== VERIFICATION COMPLETE ===' as status;
