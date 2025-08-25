/*
  # Fix contact requests RLS policy for anonymous users

  1. Security Changes
    - Drop existing public insert policy that may not be working properly
    - Create new policy specifically allowing anon role to insert contact requests
    - Ensure anonymous users can submit contact forms without authentication

  This fixes the "new row violates row-level security policy" error when
  anonymous users try to submit contact requests through the website.
*/

-- Drop the existing policy that may not be working properly
DROP POLICY IF EXISTS "Anyone can submit contact requests" ON contact_requests;

-- Create a new policy specifically for anonymous users to insert contact requests
CREATE POLICY "Allow anonymous contact request submissions"
  ON contact_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Also ensure authenticated users can still submit contact requests
CREATE POLICY "Allow authenticated contact request submissions"
  ON contact_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (true);