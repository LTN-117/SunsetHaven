-- Simply disable RLS on newsletter table
ALTER TABLE event_newsletter_signups DISABLE ROW LEVEL SECURITY;

SELECT 'RLS disabled on event_newsletter_signups!' as status;
