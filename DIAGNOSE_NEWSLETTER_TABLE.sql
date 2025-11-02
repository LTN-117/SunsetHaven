-- =====================================================
-- DIAGNOSE NEWSLETTER TABLE STRUCTURE
-- Check if table exists and show its columns
-- =====================================================

-- Check if table exists
SELECT
  CASE
    WHEN EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'event_newsletter_signups'
    ) THEN 'Table EXISTS ✓'
    ELSE 'Table DOES NOT EXIST ✗'
  END as table_status;

-- Show all columns in the table (if it exists)
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'event_newsletter_signups'
ORDER BY ordinal_position;

-- Show RLS status
SELECT
  tablename,
  rowsecurity as "RLS Enabled"
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename = 'event_newsletter_signups';

-- Show all policies on the table (if any)
SELECT
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'event_newsletter_signups';

SELECT '====================' as separator;
SELECT 'If table does not exist, run CREATE_NEWSLETTER_TABLE.sql' as action_needed;
SELECT 'If table exists but has wrong columns, check column list above' as check_columns;
