-- =====================================================
-- SIMPLE DEBUG - Check each thing separately
-- =====================================================

-- Step 1: Check auth user
SELECT 'Step 1: Auth User Check' as step;
SELECT * FROM auth.users WHERE email = 'lighteningconsultancy@gmail.com';

-- Step 2: Check admin profile
SELECT 'Step 2: Admin Profile Check' as step;
SELECT * FROM admin_profiles WHERE email = 'lighteningconsultancy@gmail.com';

-- Step 3: Check if admin_profiles table exists
SELECT 'Step 3: Table Check' as step;
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = 'admin_profiles'
) as admin_profiles_exists;

-- Step 4: Count all rows in admin_profiles
SELECT 'Step 4: Row Count' as step;
SELECT COUNT(*) as total_profiles FROM admin_profiles;

-- Step 5: Show ALL admin profiles (if any)
SELECT 'Step 5: All Profiles' as step;
SELECT * FROM admin_profiles LIMIT 10;
