-- Create services table in aradaa_int schema
CREATE TABLE IF NOT EXISTS "aradaa_int"."services" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Service Details
  icon TEXT NOT NULL, -- Icon name from lucide-react (e.g., "Home", "Building2", "Landmark", "Heart")
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  
  -- Styling
  color TEXT NOT NULL, -- Gradient class (e.g., "from-orange-500 to-red-500")
  
  -- Category for portfolio filtering
  category TEXT NOT NULL, -- Must match portfolio categories (e.g., "Residential", "Office", "Government", "Mosque")
  
  -- Display Settings
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create unique constraint on title to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS idx_services_title_unique ON "aradaa_int"."services"(title);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_services_is_active ON "aradaa_int"."services"(is_active);
CREATE INDEX IF NOT EXISTS idx_services_display_order ON "aradaa_int"."services"(display_order);

-- Create trigger to update updated_at timestamp
DROP TRIGGER IF EXISTS update_services_updated_at ON "aradaa_int"."services";

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON "aradaa_int"."services"
  FOR EACH ROW
  EXECUTE FUNCTION "aradaa_int".update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE "aradaa_int"."services" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Allow public read access to services" ON "aradaa_int"."services";
DROP POLICY IF EXISTS "Allow authenticated insert to services" ON "aradaa_int"."services";
DROP POLICY IF EXISTS "Allow authenticated update to services" ON "aradaa_int"."services";
DROP POLICY IF EXISTS "Allow authenticated delete to services" ON "aradaa_int"."services";

-- RLS Policies
-- Allow public read access to active services
CREATE POLICY "Allow public read access to services"
  ON "aradaa_int"."services"
  FOR SELECT
  USING (is_active = true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated insert to services"
  ON "aradaa_int"."services"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated update to services"
  ON "aradaa_int"."services"
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated delete to services"
  ON "aradaa_int"."services"
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert default services data
INSERT INTO "aradaa_int"."services" (
  icon,
  title,
  description,
  color,
  category,
  display_order,
  is_active
) VALUES 
  (
    'Home',
    'Residential Homes',
    'Create your dream home with custom interior designs that reflect your personality and lifestyle.',
    'from-orange-500 to-red-500',
    'Residential',
    0,
    true
  ),
  (
    'Building2',
    'Business Offices',
    'Boost productivity with modern, functional office spaces designed for success and collaboration.',
    'from-blue-500 to-indigo-500',
    'Office',
    1,
    true
  ),
  (
    'Landmark',
    'Government Buildings',
    'Professional and dignified interiors that serve the public with style and functionality.',
    'from-purple-500 to-pink-500',
    'Government',
    2,
    true
  ),
  (
    'Heart',
    'Mosques',
    'Sacred spaces designed with reverence, combining traditional aesthetics with modern comfort.',
    'from-emerald-500 to-teal-500',
    'Mosque',
    3,
    true
  )
ON CONFLICT (title) DO NOTHING;

