/*
  # Fix RLS policies for contact_requests table

  1. Security Updates
    - Drop existing problematic policies
    - Create new policy allowing anonymous users to insert contact requests
    - Create new policy allowing authenticated users to insert contact requests
    - Maintain existing admin read/update policies

  This fixes the "new row violates row-level security policy" error by ensuring
  both anonymous (anon) and authenticated users can submit contact requests.
*/

-- Drop existing insert policies that may be causing issues
DROP POLICY IF EXISTS "Allow anonymous contact request submissions" ON contact_requests;
DROP POLICY IF EXISTS "Allow authenticated contact request submissions" ON contact_requests;

-- Create new policy for anonymous users to insert contact requests
CREATE POLICY "Anonymous users can submit contact requests"
  ON contact_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create new policy for authenticated users to insert contact requests
CREATE POLICY "Authenticated users can submit contact requests"
  ON contact_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (true);