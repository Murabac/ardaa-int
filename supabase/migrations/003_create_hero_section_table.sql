-- Create hero_section table in aradaa_int schema
CREATE TABLE IF NOT EXISTS "aradaa_int"."hero_section" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Badge/Banner
  badge_text TEXT,
  
  -- Main Heading
  title_line1 TEXT NOT NULL,
  title_line2 TEXT NOT NULL,
  title_line2_color TEXT DEFAULT '#E87842',
  
  -- Description
  description TEXT NOT NULL,
  
  -- Features List (stored as JSON array)
  features JSONB DEFAULT '[]'::jsonb,
  
  -- Buttons
  primary_button_text TEXT DEFAULT 'View Our Work',
  primary_button_action TEXT DEFAULT 'scroll:portfolio',
  secondary_button_text TEXT DEFAULT 'Watch Showreel',
  secondary_button_action TEXT,
  
  -- Images
  featured_image_url TEXT,
  featured_image_alt TEXT,
  featured_project_title TEXT,
  
  -- Featured Project 1 (Main/Large Featured Project)
  featured_project_1_title TEXT,
  featured_project_1_image_url TEXT,
  featured_project_1_image_alt TEXT,
  featured_project_1_category TEXT,
  
  -- Featured Project 2 (Smaller Project)
  featured_project_2_title TEXT,
  featured_project_2_image_url TEXT,
  featured_project_2_image_alt TEXT,
  featured_project_2_category TEXT,
  
  -- Featured Project 3 (Smaller Project)
  featured_project_3_title TEXT,
  featured_project_3_image_url TEXT,
  featured_project_3_image_alt TEXT,
  featured_project_3_category TEXT,
  
  -- Gallery Images (stored as JSON array)
  gallery_images JSONB DEFAULT '[]'::jsonb,
  
  -- Ready to Start Section
  ready_to_start_text TEXT DEFAULT 'Ready to Start?',
  ready_to_start_button_text TEXT DEFAULT 'Contact Us',
  ready_to_start_action TEXT DEFAULT 'scroll:contact',
  
  -- Active/Published flag
  is_active BOOLEAN DEFAULT true,
  
  -- Order/Position (for multiple hero sections)
  display_order INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for active hero sections
CREATE INDEX IF NOT EXISTS idx_hero_section_active ON "aradaa_int"."hero_section"(is_active, display_order);

-- Add featured project columns if they don't exist (for existing tables)
DO $$ 
BEGIN
  -- Featured Project 1
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'aradaa_int' 
    AND table_name = 'hero_section' 
    AND column_name = 'featured_project_1_title'
  ) THEN
    ALTER TABLE "aradaa_int"."hero_section" 
    ADD COLUMN featured_project_1_title TEXT,
    ADD COLUMN featured_project_1_image_url TEXT,
    ADD COLUMN featured_project_1_image_alt TEXT,
    ADD COLUMN featured_project_1_category TEXT;
  END IF;
  
  -- Featured Project 2
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'aradaa_int' 
    AND table_name = 'hero_section' 
    AND column_name = 'featured_project_2_title'
  ) THEN
    ALTER TABLE "aradaa_int"."hero_section" 
    ADD COLUMN featured_project_2_title TEXT,
    ADD COLUMN featured_project_2_image_url TEXT,
    ADD COLUMN featured_project_2_image_alt TEXT,
    ADD COLUMN featured_project_2_category TEXT;
  END IF;
  
  -- Featured Project 3
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'aradaa_int' 
    AND table_name = 'hero_section' 
    AND column_name = 'featured_project_3_title'
  ) THEN
    ALTER TABLE "aradaa_int"."hero_section" 
    ADD COLUMN featured_project_3_title TEXT,
    ADD COLUMN featured_project_3_image_url TEXT,
    ADD COLUMN featured_project_3_image_alt TEXT,
    ADD COLUMN featured_project_3_category TEXT;
  END IF;
END $$;

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION "aradaa_int".update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists, then create it
DROP TRIGGER IF EXISTS update_hero_section_updated_at ON "aradaa_int"."hero_section";

CREATE TRIGGER update_hero_section_updated_at
  BEFORE UPDATE ON "aradaa_int"."hero_section"
  FOR EACH ROW
  EXECUTE FUNCTION "aradaa_int".update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE "aradaa_int"."hero_section" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to hero_section" ON "aradaa_int"."hero_section";
DROP POLICY IF EXISTS "Allow authenticated users to insert hero_section" ON "aradaa_int"."hero_section";
DROP POLICY IF EXISTS "Allow authenticated users to update hero_section" ON "aradaa_int"."hero_section";
DROP POLICY IF EXISTS "Allow authenticated users to delete hero_section" ON "aradaa_int"."hero_section";

-- Create policies
-- Allow public read access
CREATE POLICY "Allow public read access to hero_section"
  ON "aradaa_int"."hero_section"
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert hero_section"
  ON "aradaa_int"."hero_section"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated users to update hero_section"
  ON "aradaa_int"."hero_section"
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated users to delete hero_section"
  ON "aradaa_int"."hero_section"
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert default hero section data
INSERT INTO "aradaa_int"."hero_section" (
  badge_text,
  title_line1,
  title_line2,
  title_line2_color,
  description,
  features,
  primary_button_text,
  primary_button_action,
  secondary_button_text,
  secondary_button_action,
  featured_image_url,
  featured_image_alt,
  featured_project_title,
  featured_project_1_title,
  featured_project_1_image_url,
  featured_project_1_image_alt,
  featured_project_1_category,
  featured_project_2_title,
  featured_project_2_image_url,
  featured_project_2_image_alt,
  featured_project_2_category,
  featured_project_3_title,
  featured_project_3_image_url,
  featured_project_3_image_alt,
  featured_project_3_category,
  gallery_images,
  ready_to_start_text,
  ready_to_start_button_text,
  ready_to_start_action,
  is_active,
  display_order
) VALUES (
  'Award-Winning Design Studio',
  'Transform Your',
  'Vision Into Reality',
  '#E87842',
  'From residential homes to mosques, government buildings to corporate offices — we craft exceptional interior spaces that inspire and endure.',
  '["15+ Years of Excellence", "Custom Design Solutions", "200+ Completed Projects"]'::jsonb,
  'View Our Work',
  'scroll:portfolio',
  'Watch Showreel',
  NULL,
  '/images/feature-1.jpg',
  'Luxury Interior Design',
  'Modern Masjid Design',
  -- Featured Project 1 (Main Featured)
  'Modern Masjid Design',
  '/images/feature-1.jpg',
  'Luxury Interior Design',
  'Mosque',
  -- Featured Project 2
  'Government Office Design',
  '/images/feature-5.jpg',
  'Interior Design Showcase',
  'Government',
  -- Featured Project 3
  'Commercial Space',
  '/images/feature-2.jpg',
  'Modern Architecture Interior',
  'Commercial',
  '[
    {"url": "/images/feature-5.jpg", "alt": "Interior Design Showcase", "title": "Government Office Design"},
    {"url": "/images/feature-2.jpg", "alt": "Modern Architecture Interior", "title": "Commercial Space"}
  ]'::jsonb,
  'Ready to Start?',
  'Contact Us',
  'scroll:contact',
  true,
  0
) ON CONFLICT DO NOTHING;

