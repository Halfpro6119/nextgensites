/*
  # Fix RLS policies for user profile creation

  1. Policy Changes
    - Update insert policy to allow user profile creation during signup
    - Ensure proper authentication checks for existing policies

  2. Security
    - Maintain security by ensuring users can only create their own profiles
    - Keep existing update and select policies intact
*/

-- Drop the existing insert policy
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;

-- Create a new insert policy that allows profile creation during signup
CREATE POLICY "Users can insert their own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = auth_user_id);

-- Ensure the update policy is correct
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = auth_user_id)
  WITH CHECK (auth.uid() = auth_user_id);

-- Ensure the select policy is correct
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "Users can view their own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = auth_user_id);