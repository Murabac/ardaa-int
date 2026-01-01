-- Create projects table in aradaa_int schema
CREATE TABLE IF NOT EXISTS "aradaa_int"."projects" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Project Details
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  
  -- Category for filtering (must match service categories)
  category TEXT NOT NULL CHECK (category IN ('Residential', 'Office', 'Government', 'Mosque')),
  
  -- Image
  image_url TEXT NOT NULL,
  image_alt TEXT,
  
  -- Display Settings
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false, -- For featured projects
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create unique constraint on title to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_title_unique ON "aradaa_int"."projects"(title);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_projects_category ON "aradaa_int"."projects"(category);
CREATE INDEX IF NOT EXISTS idx_projects_is_active ON "aradaa_int"."projects"(is_active);
CREATE INDEX IF NOT EXISTS idx_projects_is_featured ON "aradaa_int"."projects"(is_featured);
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON "aradaa_int"."projects"(display_order);

-- Create trigger to update updated_at timestamp
DROP TRIGGER IF EXISTS update_projects_updated_at ON "aradaa_int"."projects";

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON "aradaa_int"."projects"
  FOR EACH ROW
  EXECUTE FUNCTION "aradaa_int".update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE "aradaa_int"."projects" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Allow public read access to projects" ON "aradaa_int"."projects";
DROP POLICY IF EXISTS "Allow authenticated insert to projects" ON "aradaa_int"."projects";
DROP POLICY IF EXISTS "Allow authenticated update to projects" ON "aradaa_int"."projects";
DROP POLICY IF EXISTS "Allow authenticated delete to projects" ON "aradaa_int"."projects";

-- RLS Policies
-- Allow public read access to active projects
CREATE POLICY "Allow public read access to projects"
  ON "aradaa_int"."projects"
  FOR SELECT
  USING (is_active = true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated insert to projects"
  ON "aradaa_int"."projects"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated update to projects"
  ON "aradaa_int"."projects"
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated delete to projects"
  ON "aradaa_int"."projects"
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert default projects data
INSERT INTO "aradaa_int"."projects" (
  title,
  description,
  category,
  image_url,
  image_alt,
  display_order,
  is_featured,
  is_active
) VALUES 
  (
    'Modern Living Room',
    'Contemporary design with warm aesthetics',
    'Residential',
    '/images/feature-1.jpg',
    'Modern Living Room Interior',
    0,
    true,
    true
  ),
  (
    'Executive Office Suite',
    'Luxury workspace for productivity',
    'Office',
    '/images/feature-2.jpg',
    'Executive Office Suite Interior',
    1,
    true,
    true
  ),
  (
    'Prayer Hall Interior',
    'Sacred space with elegant details',
    'Mosque',
    '/images/feature-3.jpg',
    'Prayer Hall Interior Design',
    2,
    true,
    true
  ),
  (
    'Elegant Home Interior',
    'Minimalist sophistication',
    'Residential',
    '/images/feature-4.jpg',
    'Elegant Home Interior Design',
    3,
    false,
    true
  ),
  (
    'Government Hall',
    'Professional and dignified spaces',
    'Government',
    '/images/feature-5.jpg',
    'Government Hall Interior',
    4,
    true,
    true
  ),
  (
    'Contemporary Bedroom',
    'Serene and stylish retreat',
    'Residential',
    '/images/feature-6.jpg',
    'Contemporary Bedroom Design',
    5,
    false,
    true
  ),
  (
    'Modern Office Design',
    'Innovative workspace solutions',
    'Office',
    '/images/feature-7.jpg',
    'Modern Office Design Interior',
    6,
    false,
    true
  ),
  (
    'Modern Masjid Design',
    'Beautiful sacred spaces',
    'Mosque',
    '/images/feature-8.jpg',
    'Modern Masjid Interior Design',
    7,
    false,
    true
  ),
  (
    'Government Office Design',
    'Professional institutional spaces',
    'Government',
    '/images/feature-9.jpg',
    'Government Office Interior Design',
    8,
    false,
    true
  )
ON CONFLICT (title) DO NOTHING;

