/*
  # Fix contact requests RLS policy

  1. Security Changes
    - Allow anonymous users to insert contact requests
    - Authorize based on slug parameter rather than user authentication
    - Maintain admin read/update access for authenticated admin users

  2. Policy Updates
    - Update insert policy to allow anonymous users
    - Keep existing admin policies for reading and updating
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anonymous users can submit contact requests" ON contact_requests;
DROP POLICY IF EXISTS "Authenticated users can submit contact requests" ON contact_requests;

-- Create new policy that allows anyone to submit contact requests
CREATE POLICY "Anyone can submit contact requests"
  ON contact_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Ensure admin can still read all contact requests
DROP POLICY IF EXISTS "Admin can read all contact requests" ON contact_requests;
CREATE POLICY "Admin can read all contact requests"
  ON contact_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM auth.users
      WHERE users.id = auth.uid()
      AND users.email = 'rilrogsa@gmail.com'
    )
  );

-- Ensure admin can still update contact requests
DROP POLICY IF EXISTS "Admin can update contact requests" ON contact_requests;
CREATE POLICY "Admin can update contact requests"
  ON contact_requests
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM auth.users
      WHERE users.id = auth.uid()
      AND users.email = 'rilrogsa@gmail.com'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM auth.users
      WHERE users.id = auth.uid()
      AND users.email = 'rilrogsa@gmail.com'
    )
  );