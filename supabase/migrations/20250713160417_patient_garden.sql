/*
  # Fix user signup permissions

  1. Security Updates
    - Update RLS policy on `users` table to allow profile creation during signup
    - Ensure authenticated users can create their own profile
    - Allow public (anon) users to insert during signup process

  2. Changes
    - Drop existing restrictive INSERT policy
    - Add new INSERT policy that allows both anon and authenticated users to create profiles
    - Ensure the policy checks that the auth_user_id matches the current user
*/

-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Allow user profile creation during signup" ON users;

-- Create a new INSERT policy that allows profile creation during signup
-- This allows both anon (during signup) and authenticated users to create profiles
-- but only for their own auth_user_id
CREATE POLICY "Enable user profile creation during signup"
  ON users
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (auth.uid() = auth_user_id);

-- Ensure the UPDATE policy allows users to update their own profile
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = auth_user_id)
  WITH CHECK (auth.uid() = auth_user_id);

-- Ensure the SELECT policy allows users to view their own profile
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "Users can view their own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = auth_user_id);