/*
  # Fix user creation authorization issue

  1. Changes
    - Allow unauthenticated users to insert into users table (needed for signup)
    - Keep existing policies for authenticated operations
    - Ensure new users can only insert records with their own auth_user_id

  2. Security
    - Insert policy ensures users can only create records for themselves
    - Update/Select policies remain restricted to authenticated users
*/

-- Drop existing insert policy that requires authentication
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;

-- Create new insert policy that allows unauthenticated inserts but restricts to own auth_user_id
CREATE POLICY "Allow user profile creation during signup"
  ON users
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = auth_user_id);

-- Keep existing authenticated policies for updates and selects
-- (These should already exist but ensuring they're correct)
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = auth_user_id)
  WITH CHECK (auth.uid() = auth_user_id);

DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "Users can view their own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = auth_user_id);