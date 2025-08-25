/*
  # Audit and Demo System

  1. New Tables
    - `audit_demos`: Stores all audit and demo data for cold outreach
      - Contains business info, owner details, customer-facing content
      - Includes pain points, benefits, testimonials, and CTAs
      - SEO and tracking configuration

  2. Security
    - Enable RLS on `audit_demos` table
    - Public read access for demo pages (no auth required)
    - Admin-only write access for creating new audits

  3. Indexes
    - Unique index on slug for fast lookups
    - Index on created_at for admin dashboard
*/

CREATE TABLE IF NOT EXISTS audit_demos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  
  -- Business Information
  business_name text NOT NULL,
  industry text NOT NULL,
  owner_name text NOT NULL,
  email text NOT NULL,
  
  -- Owner-focused content (for /review page)
  owner_pain_point_1 text NOT NULL,
  owner_pain_point_2 text NOT NULL,
  owner_conversion_benefit_1 text NOT NULL,
  owner_conversion_benefit_2 text NOT NULL,
  owner_conversion_benefit_3 text NOT NULL,
  owner_hook_quote text NOT NULL,
  owner_cta_text text NOT NULL DEFAULT 'Want this live on your real website?',
  owner_cta_link text NOT NULL DEFAULT 'mailto:riley@nextgensites.net',
  
  -- Customer-facing content (for /demo page)
  hero_heading text NOT NULL,
  hero_subheading text NOT NULL,
  customer_pain_point_1 text NOT NULL,
  customer_pain_point_2 text NOT NULL,
  customer_conversion_benefit_1 text NOT NULL,
  customer_conversion_benefit_2 text NOT NULL,
  customer_conversion_benefit_3 text NOT NULL,
  customer_benefit_1 text NOT NULL,
  customer_benefit_2 text NOT NULL,
  customer_benefit_3 text NOT NULL,
  
  -- Process steps
  process_step_1 text NOT NULL,
  process_step_2 text NOT NULL,
  process_step_3 text NOT NULL,
  
  -- Customer CTAs
  customer_hook_quote text NOT NULL,
  customer_cta_text text NOT NULL DEFAULT 'Get Started Today',
  customer_cta_link text NOT NULL DEFAULT '#contact',
  
  -- Social proof
  google_rating numeric(2,1) DEFAULT 5.0,
  review_1 text NOT NULL,
  review_2 text NOT NULL,
  review_3 text NOT NULL,
  reviewer_1 text NOT NULL,
  reviewer_2 text NOT NULL,
  reviewer_3 text NOT NULL,
  
  -- Tracking
  ga_tracking_id text,
  
  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE audit_demos ENABLE ROW LEVEL SECURITY;

-- Allow public read access for demo pages (no auth required)
CREATE POLICY "Public read access for audit demos"
  ON audit_demos
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only authenticated users can insert/update (for admin use)
CREATE POLICY "Authenticated users can manage audit demos"
  ON audit_demos
  FOR ALL
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_demos_slug ON audit_demos(slug);
CREATE INDEX IF NOT EXISTS idx_audit_demos_created_at ON audit_demos(created_at DESC);