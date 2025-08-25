/*
  # Fix inbox permissions for admin access

  1. Security Updates
    - Update contact_requests policies to allow admin access without referencing auth.users
    - Update next_steps_questions policies to allow admin access without referencing auth.users
    - Ensure admin can read all contact requests and next steps questions

  2. Changes
    - Modify existing RLS policies to use direct email comparison instead of JOIN with users table
    - This avoids the permission denied error on the users table
*/

-- Drop existing problematic policies for contact_requests
DROP POLICY IF EXISTS "Admin can read all contact requests" ON contact_requests;
DROP POLICY IF EXISTS "Admin can update contact requests" ON contact_requests;

-- Create new policies that don't reference the users table
CREATE POLICY "Admin can read all contact requests"
  ON contact_requests
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'rilrogsa@gmail.com');

CREATE POLICY "Admin can update contact requests"
  ON contact_requests
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'rilrogsa@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'rilrogsa@gmail.com');

-- Update next_steps_questions policies if they have similar issues
DROP POLICY IF EXISTS "Authenticated users can read all next steps questions" ON next_steps_questions;
DROP POLICY IF EXISTS "Authenticated users can update next steps questions" ON next_steps_questions;
DROP POLICY IF EXISTS "Authenticated users can delete next steps questions" ON next_steps_questions;

-- Create new policies for next_steps_questions
CREATE POLICY "Admin can read all next steps questions"
  ON next_steps_questions
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'rilrogsa@gmail.com');

CREATE POLICY "Admin can update next steps questions"
  ON next_steps_questions
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'rilrogsa@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'rilrogsa@gmail.com');

CREATE POLICY "Admin can delete next steps questions"
  ON next_steps_questions
  FOR DELETE
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'rilrogsa@gmail.com');