-- =====================================================
-- FIX NEWSLETTER RLS POLICIES
-- Allow authenticated admin users to read newsletter signups
-- =====================================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Admins can view newsletter signups" ON event_newsletter_signups;
DROP POLICY IF EXISTS "Anyone can sign up" ON event_newsletter_signups;
DROP POLICY IF EXISTS "Public can insert" ON event_newsletter_signups;

-- Allow anyone to insert (sign up for newsletter)
CREATE POLICY "Anyone can sign up for newsletter"
  ON event_newsletter_signups
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow authenticated users (admins) to read all signups
CREATE POLICY "Authenticated users can view all signups"
  ON event_newsletter_signups
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users (admins) to delete signups
CREATE POLICY "Authenticated users can delete signups"
  ON event_newsletter_signups
  FOR DELETE
  TO authenticated
  USING (true);

SELECT 'Newsletter RLS policies fixed!' as message;
SELECT 'Refresh the newsletter admin page - it should work now!' as next_step;
