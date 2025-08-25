/*
  # Fix RLS policy for next_steps_questions table

  1. Security Changes
    - Drop existing INSERT policy that's blocking anonymous users
    - Create new policy to allow anonymous users to insert questions
    - Ensure both anon and authenticated roles can submit questions

  This fixes the "new row violates row-level security policy" error
  when anonymous users try to submit questions through the contact form.
*/

-- Drop the existing INSERT policy that's causing issues
DROP POLICY IF EXISTS "Allow public insert for next steps questions" ON next_steps_questions;

-- Create a new policy that explicitly allows anonymous users to insert
CREATE POLICY "Enable anonymous insert for next steps questions"
  ON next_steps_questions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);