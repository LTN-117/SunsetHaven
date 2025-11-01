-- =====================================================
-- CREATE YOUR ADMIN PROFILE MANUALLY
-- Run this if you can login but get redirected back to login
-- =====================================================

-- IMPORTANT: Replace 'your-email@example.com' with your actual email
-- and 'Your Full Name' with your actual name

-- First, check if profile exists
SELECT
  au.id,
  au.email,
  ap.full_name,
  ap.role,
  ap.is_active
FROM auth.users au
LEFT JOIN admin_profiles ap ON au.id = ap.id
WHERE au.email = 'your-email@example.com';

-- If the profile is NULL, create it manually
INSERT INTO admin_profiles (id, email, full_name, role, is_active, is_deletable)
SELECT
  id,
  email,
  'Your Full Name',
  'super_admin',
  true,
  false
FROM auth.users
WHERE email = 'your-email@example.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'super_admin',
  is_deletable = false,
  is_active = true;

-- Verify it was created
SELECT
  ap.id,
  ap.email,
  ap.full_name,
  ap.role,
  ap.is_active,
  ap.is_deletable
FROM admin_profiles ap
WHERE ap.email = 'your-email@example.com';

SELECT 'Admin profile created/updated successfully!' as message;
