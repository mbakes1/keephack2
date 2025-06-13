/*
  # Fix Asset Relationships

  1. Changes
    - Fix foreign key constraints to reference correct tables
    - Ensure proper relationships for PostgREST to recognize 'category' join
    - Add missing users table if needed

  2. Security
    - Maintain existing RLS policies
*/

-- First, let's ensure we have a users table that references auth.users
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Add policy for users to read their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Drop existing foreign key constraints that might be incorrect
DO $$
BEGIN
  -- Drop foreign key constraints if they exist
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'assets_created_by_fkey' 
    AND table_name = 'assets'
  ) THEN
    ALTER TABLE assets DROP CONSTRAINT assets_created_by_fkey;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'asset_assignments_created_by_fkey' 
    AND table_name = 'asset_assignments'
  ) THEN
    ALTER TABLE asset_assignments DROP CONSTRAINT asset_assignments_created_by_fkey;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'asset_maintenance_created_by_fkey' 
    AND table_name = 'asset_maintenance'
  ) THEN
    ALTER TABLE asset_maintenance DROP CONSTRAINT asset_maintenance_created_by_fkey;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'asset_documents_uploaded_by_fkey' 
    AND table_name = 'asset_documents'
  ) THEN
    ALTER TABLE asset_documents DROP CONSTRAINT asset_documents_uploaded_by_fkey;
  END IF;
END $$;

-- Re-add foreign key constraints with correct references
ALTER TABLE assets 
ADD CONSTRAINT assets_created_by_fkey 
FOREIGN KEY (created_by) REFERENCES users(id);

ALTER TABLE asset_assignments 
ADD CONSTRAINT asset_assignments_created_by_fkey 
FOREIGN KEY (created_by) REFERENCES users(id);

ALTER TABLE asset_maintenance 
ADD CONSTRAINT asset_maintenance_created_by_fkey 
FOREIGN KEY (created_by) REFERENCES users(id);

ALTER TABLE asset_documents 
ADD CONSTRAINT asset_documents_uploaded_by_fkey 
FOREIGN KEY (uploaded_by) REFERENCES users(id);

-- Ensure the category foreign key constraint exists and is properly named
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'assets_category_id_fkey' 
    AND table_name = 'assets'
  ) THEN
    ALTER TABLE assets 
    ADD CONSTRAINT assets_category_id_fkey 
    FOREIGN KEY (category_id) REFERENCES asset_categories(id);
  END IF;
END $$;

-- Create a function to automatically create user records
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO UPDATE SET
    email = NEW.email,
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user records
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();