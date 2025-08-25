/*
  # Fix RLS policy for next_steps_questions table

  1. Security Changes
    - Update insert policy to allow anonymous submissions
    - Ensure the policy matches the application's intended behavior
    
  The current policy only allows authenticated users to insert, but the application
  is designed to accept questions from anonymous visitors on demo pages.
*/

-- Drop the existing restrictive insert policy
DROP POLICY IF EXISTS "Enable anonymous insert for next steps questions" ON next_steps_questions;

-- Create a new policy that allows both anonymous and authenticated users to insert
CREATE POLICY "Allow anonymous and authenticated insert for next steps questions"
  ON next_steps_questions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);