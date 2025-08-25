/*
  # User Data Tracking System

  1. New Tables
    - `users` - Custom user profiles linked to Supabase auth
    - `user_consultations` - Store consultation form submissions
    - `user_onboarding` - Store onboarding form data
    - `user_package_selections` - Track package choices and purchase status
    - `user_sessions` - Track user activity and form progress

  2. Security
    - Enable RLS on all new tables
    - Add policies for users to manage their own data
    - Add policies for authenticated access

  3. Features
    - Track form submissions with timestamps
    - Store package selection history
    - Monitor purchase completion status
    - Link all data to authenticated users
*/

-- Create users table for extended user profiles
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text DEFAULT '',
  phone text DEFAULT '',
  company text DEFAULT '',
  website text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_login timestamptz DEFAULT now(),
  UNIQUE(auth_user_id),
  UNIQUE(email)
);

-- Create user_consultations table
CREATE TABLE IF NOT EXISTS user_consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text DEFAULT '',
  company text DEFAULT '',
  website text DEFAULT '',
  question text NOT NULL DEFAULT '',
  automations text DEFAULT '',
  source text DEFAULT '',
  submitted_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_onboarding table
CREATE TABLE IF NOT EXISTS user_onboarding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  business_name text DEFAULT '',
  business_description text DEFAULT '',
  goals jsonb DEFAULT '[]'::jsonb,
  other_goal text DEFAULT '',
  design_style text DEFAULT '',
  current_website text DEFAULT '',
  inspiration_sites text DEFAULT '',
  desired_pages text DEFAULT '',
  avoid_features text DEFAULT '',
  budget text DEFAULT '',
  additional_info text DEFAULT '',
  assets_uploaded boolean DEFAULT false,
  submitted_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_package_selections table
CREATE TABLE IF NOT EXISTS user_package_selections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  package_type text NOT NULL, -- 'website' or 'care_plan'
  package_id text NOT NULL,
  package_name text NOT NULL,
  price_id text NOT NULL,
  price text NOT NULL,
  mode text NOT NULL, -- 'payment' or 'subscription'
  selected_at timestamptz DEFAULT now(),
  checkout_initiated boolean DEFAULT false,
  checkout_session_id text DEFAULT '',
  purchase_completed boolean DEFAULT false,
  purchase_completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_sessions table for tracking user activity
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  session_start timestamptz DEFAULT now(),
  session_end timestamptz,
  pages_visited jsonb DEFAULT '[]'::jsonb,
  forms_started jsonb DEFAULT '[]'::jsonb,
  forms_completed jsonb DEFAULT '[]'::jsonb,
  last_activity timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_package_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth_user_id = auth.uid());

CREATE POLICY "Users can insert their own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth_user_id = auth.uid());

-- Create policies for user_consultations table
CREATE POLICY "Users can view their own consultations"
  ON user_consultations
  FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can insert their own consultations"
  ON user_consultations
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update their own consultations"
  ON user_consultations
  FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

-- Create policies for user_onboarding table
CREATE POLICY "Users can view their own onboarding"
  ON user_onboarding
  FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can insert their own onboarding"
  ON user_onboarding
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update their own onboarding"
  ON user_onboarding
  FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

-- Create policies for user_package_selections table
CREATE POLICY "Users can view their own package selections"
  ON user_package_selections
  FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can insert their own package selections"
  ON user_package_selections
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update their own package selections"
  ON user_package_selections
  FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

-- Create policies for user_sessions table
CREATE POLICY "Users can view their own sessions"
  ON user_sessions
  FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can insert their own sessions"
  ON user_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update their own sessions"
  ON user_sessions
  FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_consultations_user_id ON user_consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_consultations_submitted_at ON user_consultations(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_onboarding_user_id ON user_onboarding(user_id);
CREATE INDEX IF NOT EXISTS idx_user_onboarding_submitted_at ON user_onboarding(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_package_selections_user_id ON user_package_selections(user_id);
CREATE INDEX IF NOT EXISTS idx_user_package_selections_selected_at ON user_package_selections(selected_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_start ON user_sessions(session_start DESC);

-- Create function to automatically create user profile on auth signup
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (auth_user_id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile
DROP TRIGGER IF EXISTS create_user_profile_trigger ON auth.users;
CREATE TRIGGER create_user_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();

-- Create function to update user last_login
CREATE OR REPLACE FUNCTION update_user_last_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users 
  SET last_login = now(), updated_at = now()
  WHERE auth_user_id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update last_login on auth sessions
DROP TRIGGER IF EXISTS update_user_last_login_trigger ON auth.sessions;
CREATE TRIGGER update_user_last_login_trigger
  AFTER INSERT ON auth.sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_last_login();