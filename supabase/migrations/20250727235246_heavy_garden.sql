/*
  # Fix Next Steps Questions RLS Policies

  1. Security Updates
    - Update RLS policies to allow anonymous submissions
    - Ensure authenticated users can also submit
    - Fix admin read/update policies

  2. Changes
    - Modified insert policy to allow both anonymous and authenticated users
    - Ensured proper policy conditions for admin access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow anonymous and authenticated insert for next steps questio" ON next_steps_questions;
DROP POLICY IF EXISTS "Admin can read all next steps questions" ON next_steps_questions;
DROP POLICY IF EXISTS "Admin can update next steps questions" ON next_steps_questions;
DROP POLICY IF EXISTS "Admin can delete next steps questions" ON next_steps_questions;

-- Create new policies with proper permissions
CREATE POLICY "Allow anonymous and authenticated users to insert questions"
  ON next_steps_questions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can read all next steps questions"
  ON next_steps_questions
  FOR SELECT
  TO authenticated
  USING (
    (current_setting('request.jwt.claims', true)::json ->> 'email') = 'rilrogsa@gmail.com'
  );

CREATE POLICY "Admin can update next steps questions"
  ON next_steps_questions
  FOR UPDATE
  TO authenticated
  USING (
    (current_setting('request.jwt.claims', true)::json ->> 'email') = 'rilrogsa@gmail.com'
  )
  WITH CHECK (
    (current_setting('request.jwt.claims', true)::json ->> 'email') = 'rilrogsa@gmail.com'
  );

CREATE POLICY "Admin can delete next steps questions"
  ON next_steps_questions
  FOR DELETE
  TO authenticated
  USING (
    (current_setting('request.jwt.claims', true)::json ->> 'email') = 'rilrogsa@gmail.com'
  );