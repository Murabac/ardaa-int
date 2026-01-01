-- Create showreel_images table in aradaa_int schema
-- This table stores images and videos for the showreel carousel
CREATE TABLE IF NOT EXISTS "aradaa_int"."showreel_images" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Media Details
  media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  image_url TEXT NOT NULL,
  image_alt TEXT,
  title TEXT,
  description TEXT,
  
  -- Display Settings
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add media_type column if it doesn't exist (for existing tables that were created before this migration)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'aradaa_int' 
    AND table_name = 'showreel_images'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'aradaa_int' 
    AND table_name = 'showreel_images' 
    AND column_name = 'media_type'
  ) THEN
    ALTER TABLE "aradaa_int"."showreel_images" 
    ADD COLUMN media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video'));
  END IF;
END $$;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_showreel_images_is_active ON "aradaa_int"."showreel_images"(is_active);
CREATE INDEX IF NOT EXISTS idx_showreel_images_display_order ON "aradaa_int"."showreel_images"(display_order);

-- Create trigger to update updated_at timestamp
DROP TRIGGER IF EXISTS update_showreel_images_updated_at ON "aradaa_int"."showreel_images";

CREATE TRIGGER update_showreel_images_updated_at
  BEFORE UPDATE ON "aradaa_int"."showreel_images"
  FOR EACH ROW
  EXECUTE FUNCTION "aradaa_int".update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE "aradaa_int"."showreel_images" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to showreel_images" ON "aradaa_int"."showreel_images";
DROP POLICY IF EXISTS "Allow authenticated insert to showreel_images" ON "aradaa_int"."showreel_images";
DROP POLICY IF EXISTS "Allow authenticated update to showreel_images" ON "aradaa_int"."showreel_images";
DROP POLICY IF EXISTS "Allow authenticated delete to showreel_images" ON "aradaa_int"."showreel_images";

-- RLS Policies
-- Allow public read access to active images
CREATE POLICY "Allow public read access to showreel_images"
  ON "aradaa_int"."showreel_images"
  FOR SELECT
  USING (is_active = true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated insert to showreel_images"
  ON "aradaa_int"."showreel_images"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated update to showreel_images"
  ON "aradaa_int"."showreel_images"
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated delete to showreel_images"
  ON "aradaa_int"."showreel_images"
  FOR DELETE
  TO authenticated
  USING (true);

-- Grant permissions to service_role
GRANT ALL ON "aradaa_int"."showreel_images" TO service_role;

-- Insert sample showreel images and videos
INSERT INTO "aradaa_int"."showreel_images" (
  media_type,
  image_url,
  image_alt,
  title,
  description,
  display_order,
  is_active
) VALUES 
  (
    'image',
    '/images/feature-1.jpg',
    'Luxury Interior Design',
    'Modern Residential Design',
    'Elegant and sophisticated interior design for modern homes',
    0,
    true
  ),
  (
    'image',
    '/images/feature-2.jpg',
    'Modern Architecture Interior',
    'Contemporary Office Space',
    'Innovative office design that promotes productivity and collaboration',
    1,
    true
  ),
  (
    'image',
    '/images/feature-3.jpg',
    'Interior Design Showcase',
    'Government Building Interior',
    'Professional and dignified design for public spaces',
    2,
    true
  ),
  (
    'image',
    '/images/feature-4.jpg',
    'Elegant Interior Design',
    'Luxury Residential Project',
    'Premium interior design with attention to detail and craftsmanship',
    3,
    true
  ),
  (
    'image',
    '/images/feature-5.jpg',
    'Interior Design Showcase',
    'Commercial Space Design',
    'Modern commercial interior that reflects brand identity',
    4,
    true
  ),
  (
    'image',
    '/images/feature-6.jpg',
    'Interior Design Project',
    'Residential Transformation',
    'Complete home renovation with modern design elements',
    5,
    true
  ),
  (
    'image',
    '/images/feature-7.jpg',
    'Interior Design Showcase',
    'Office Environment',
    'Functional and beautiful workspace design',
    6,
    true
  ),
  (
    'image',
    '/images/feature-8.jpg',
    'Interior Design Project',
    'Residential Interior',
    'Cozy and inviting home interior design',
    7,
    true
  ),
  (
    'image',
    '/images/feature-9.jpg',
    'Interior Design Showcase',
    'Modern Living Space',
    'Contemporary design that balances style and comfort',
    8,
    true
  ),
  (
    'video',
    '/videos/video-1.mp4',
    'Showreel Video 1',
    'Project Showcase Video',
    'A comprehensive showcase of our latest interior design projects',
    9,
    true
  ),
  (
    'video',
    '/videos/video-2.mp4',
    'Showreel Video 2',
    'Design Process Video',
    'Behind the scenes look at our design process and craftsmanship',
    10,
    true
  )
ON CONFLICT DO NOTHING;

