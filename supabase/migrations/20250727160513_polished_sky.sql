/*
  # Fix RLS policy for next_steps_questions table

  1. Security Changes
    - Update INSERT policy to allow anonymous users to submit questions
    - Maintain existing policies for authenticated users to read/update/delete
    - Ensure the policy allows public form submissions while maintaining security

  2. Changes Made
    - Drop existing restrictive INSERT policy
    - Create new INSERT policy that allows both anonymous and authenticated users
    - Keep all other policies unchanged for proper access control
*/

-- Drop the existing INSERT policy that's too restrictive
DROP POLICY IF EXISTS "Anyone can submit next steps questions" ON next_steps_questions;

-- Create a new INSERT policy that allows both anonymous and authenticated users
CREATE POLICY "Enable insert access for all users" 
  ON next_steps_questions 
  FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (true);