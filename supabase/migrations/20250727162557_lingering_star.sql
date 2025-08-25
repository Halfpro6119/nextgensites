/*
  # Fix RLS policy for next_steps_questions table

  1. Security Changes
    - Drop existing INSERT policy that's not working properly
    - Create new INSERT policy that explicitly allows anonymous users
    - Ensure the policy allows public access for form submissions

  This migration fixes the "new row violates row-level security policy" error
  by creating a proper INSERT policy for anonymous users.
*/

-- Drop the existing INSERT policy that's causing issues
DROP POLICY IF EXISTS "Enable insert access for all users" ON next_steps_questions;

-- Create a new INSERT policy that explicitly allows anonymous and authenticated users
CREATE POLICY "Allow public insert for next steps questions"
  ON next_steps_questions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Ensure RLS is enabled (should already be enabled but just to be safe)
ALTER TABLE next_steps_questions ENABLE ROW LEVEL SECURITY;