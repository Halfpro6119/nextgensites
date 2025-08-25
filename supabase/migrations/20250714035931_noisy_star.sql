/*
  # Remove duplicates and add unique constraint to Outreach table

  1. Data Cleanup
    - Remove duplicate records keeping only the most recent one per slug + email combination
    - Uses ROW_NUMBER() window function to identify duplicates

  2. Schema Changes
    - Add unique constraint on (slug, "contact email") to prevent future duplicates
    - This ensures each combination of slug and contact email can only exist once

  3. Important Notes
    - Keeps the record with the highest "New primary key" value (most recent)
    - The constraint will prevent INSERT/UPDATE operations that would create duplicates
*/

-- Step 1: Remove duplicates, keeping only the record with the highest "New primary key" for each slug + email combination
WITH duplicates AS (
  SELECT 
    "New primary key",
    ROW_NUMBER() OVER (
      PARTITION BY slug, "contact email" 
      ORDER BY "New primary key" DESC
    ) as rn
  FROM "Outreach"
  WHERE slug IS NOT NULL 
    AND "contact email" IS NOT NULL
)
DELETE FROM "Outreach" 
WHERE "New primary key" IN (
  SELECT "New primary key" 
  FROM duplicates 
  WHERE rn > 1
);

-- Step 2: Add unique constraint to prevent future duplicates
ALTER TABLE "Outreach" 
ADD CONSTRAINT unique_slug_contact_email 
UNIQUE (slug, "contact email");