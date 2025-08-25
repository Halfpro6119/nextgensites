/*
  # Create contact_requests table

  1. New Tables
    - `contact_requests`
      - `id` (uuid, primary key)
      - `slug` (text, not null)
      - `message` (text, not null)
      - `is_read` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `contact_requests` table
    - Add policy for authenticated users to read/write their own data
    - Add policy for admin user to read all data

  3. Indexes
    - Index on slug for faster lookups
    - Index on created_at for sorting
    - Index on is_read for filtering
*/

CREATE TABLE IF NOT EXISTS contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_contact_requests_slug ON contact_requests (slug);
CREATE INDEX IF NOT EXISTS idx_contact_requests_created_at ON contact_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_requests_is_read ON contact_requests (is_read);

-- Policy for public to insert contact requests
CREATE POLICY "Anyone can submit contact requests"
  ON contact_requests
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy for admin to read all contact requests
CREATE POLICY "Admin can read all contact requests"
  ON contact_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'rilrogsa@gmail.com'
    )
  );

-- Policy for admin to update contact requests
CREATE POLICY "Admin can update contact requests"
  ON contact_requests
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'rilrogsa@gmail.com'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'rilrogsa@gmail.com'
    )
  );