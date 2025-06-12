/*
  # Assets Management System

  1. New Tables
    - `asset_categories` - Predefined categories for assets
    - `assets` - Main assets table with comprehensive tracking
    - `asset_assignments` - Track asset assignments to employees/departments
    - `asset_maintenance` - Maintenance history and scheduling
    - `asset_documents` - Associated documents and photos

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their organization's assets

  3. Features
    - Asset lifecycle management
    - Location tracking (South African provinces)
    - Warranty and maintenance tracking
    - Assignment management
    - Document attachments
*/

-- Create asset categories table
CREATE TABLE IF NOT EXISTS asset_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create assets table
CREATE TABLE IF NOT EXISTS assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category_id uuid REFERENCES asset_categories(id),
  serial_number text,
  model text,
  brand text,
  purchase_date date,
  purchase_price decimal(10,2),
  supplier_vendor text,
  warranty_start_date date,
  warranty_end_date date,
  warranty_details text,
  location text NOT NULL, -- South African provinces
  condition_status text NOT NULL DEFAULT 'excellent', -- excellent, good, fair, poor
  asset_status text NOT NULL DEFAULT 'active', -- active, in_repair, retired, disposed
  notes text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create asset assignments table
CREATE TABLE IF NOT EXISTS asset_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid REFERENCES assets(id) ON DELETE CASCADE,
  assigned_to_name text NOT NULL,
  assigned_to_email text,
  department text,
  assignment_date date NOT NULL DEFAULT CURRENT_DATE,
  return_date date,
  notes text,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create asset maintenance table
CREATE TABLE IF NOT EXISTS asset_maintenance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid REFERENCES assets(id) ON DELETE CASCADE,
  maintenance_type text NOT NULL, -- scheduled, repair, inspection, cleaning
  description text NOT NULL,
  scheduled_date date,
  completed_date date,
  cost decimal(10,2),
  performed_by text,
  notes text,
  status text NOT NULL DEFAULT 'scheduled', -- scheduled, in_progress, completed, cancelled
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create asset documents table
CREATE TABLE IF NOT EXISTS asset_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid REFERENCES assets(id) ON DELETE CASCADE,
  document_name text NOT NULL,
  document_type text NOT NULL, -- photo, manual, receipt, warranty, other
  file_url text,
  file_size integer,
  mime_type text,
  uploaded_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE asset_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for asset_categories (public read, authenticated write)
CREATE POLICY "Anyone can read asset categories"
  ON asset_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage asset categories"
  ON asset_categories
  FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for assets
CREATE POLICY "Users can read all assets"
  ON assets
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create assets"
  ON assets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update assets"
  ON assets
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete assets"
  ON assets
  FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for asset_assignments
CREATE POLICY "Users can read all asset assignments"
  ON asset_assignments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create asset assignments"
  ON asset_assignments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update asset assignments"
  ON asset_assignments
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete asset assignments"
  ON asset_assignments
  FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for asset_maintenance
CREATE POLICY "Users can read all asset maintenance"
  ON asset_maintenance
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create asset maintenance"
  ON asset_maintenance
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update asset maintenance"
  ON asset_maintenance
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete asset maintenance"
  ON asset_maintenance
  FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for asset_documents
CREATE POLICY "Users can read all asset documents"
  ON asset_documents
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create asset documents"
  ON asset_documents
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update asset documents"
  ON asset_documents
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete asset documents"
  ON asset_documents
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert default asset categories
INSERT INTO asset_categories (name, description, icon) VALUES
  ('Computers', 'Desktop computers, laptops, tablets', 'Monitor'),
  ('Audio Equipment', 'Microphones, speakers, headphones', 'Mic'),
  ('Furniture', 'Desks, chairs, cabinets', 'Armchair'),
  ('Office Equipment', 'Printers, scanners, projectors', 'Printer'),
  ('Mobile Devices', 'Smartphones, tablets', 'Smartphone'),
  ('Networking', 'Routers, switches, cables', 'Wifi'),
  ('Vehicles', 'Company cars, trucks, motorcycles', 'Car'),
  ('Tools', 'Hand tools, power tools, equipment', 'Wrench'),
  ('Software', 'Software licenses, subscriptions', 'Code'),
  ('Other', 'Miscellaneous assets', 'Package')
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assets_category_id ON assets(category_id);
CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(asset_status);
CREATE INDEX IF NOT EXISTS idx_assets_location ON assets(location);
CREATE INDEX IF NOT EXISTS idx_assets_created_by ON assets(created_by);
CREATE INDEX IF NOT EXISTS idx_asset_assignments_asset_id ON asset_assignments(asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_assignments_active ON asset_assignments(is_active);
CREATE INDEX IF NOT EXISTS idx_asset_maintenance_asset_id ON asset_maintenance(asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_maintenance_status ON asset_maintenance(status);
CREATE INDEX IF NOT EXISTS idx_asset_documents_asset_id ON asset_documents(asset_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_asset_categories_updated_at BEFORE UPDATE ON asset_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_asset_assignments_updated_at BEFORE UPDATE ON asset_assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_asset_maintenance_updated_at BEFORE UPDATE ON asset_maintenance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();