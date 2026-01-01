-- Create about_section table in aradaa_int schema
CREATE TABLE IF NOT EXISTS "aradaa_int"."about_section" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Header
  badge_text TEXT DEFAULT 'About Ardaa',
  main_heading TEXT NOT NULL,
  
  -- Description paragraphs (stored as JSON array)
  description_paragraphs JSONB DEFAULT '[]'::jsonb,
  
  -- Stats (stored as JSON array: [{number, label, icon}])
  stats JSONB DEFAULT '[]'::jsonb,
  
  -- Values (stored as JSON array: [{icon, title, description}])
  values JSONB DEFAULT '[]'::jsonb,
  
  -- Display Settings
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_about_section_is_active ON "aradaa_int"."about_section"(is_active);
CREATE INDEX IF NOT EXISTS idx_about_section_display_order ON "aradaa_int"."about_section"(display_order);

-- Create trigger to update updated_at timestamp
DROP TRIGGER IF EXISTS update_about_section_updated_at ON "aradaa_int"."about_section";

CREATE TRIGGER update_about_section_updated_at
  BEFORE UPDATE ON "aradaa_int"."about_section"
  FOR EACH ROW
  EXECUTE FUNCTION "aradaa_int".update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE "aradaa_int"."about_section" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Allow public read access to about_section" ON "aradaa_int"."about_section";
DROP POLICY IF EXISTS "Allow authenticated insert to about_section" ON "aradaa_int"."about_section";
DROP POLICY IF EXISTS "Allow authenticated update to about_section" ON "aradaa_int"."about_section";
DROP POLICY IF EXISTS "Allow authenticated delete to about_section" ON "aradaa_int"."about_section";

-- RLS Policies
-- Allow public read access to active about section
CREATE POLICY "Allow public read access to about_section"
  ON "aradaa_int"."about_section"
  FOR SELECT
  USING (is_active = true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated insert to about_section"
  ON "aradaa_int"."about_section"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated update to about_section"
  ON "aradaa_int"."about_section"
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated delete to about_section"
  ON "aradaa_int"."about_section"
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert default about section data
INSERT INTO "aradaa_int"."about_section" (
  badge_text,
  main_heading,
  description_paragraphs,
  stats,
  values,
  is_active,
  display_order
) VALUES (
  'About Ardaa',
  'Designing Dreams Since 2010',
  '[
    "Ardaa Interior Firm is a leading design studio specializing in creating exceptional interior spaces that inspire and delight. With over 15 years of experience, we''ve transformed hundreds of spaces across residential, commercial, government, and religious sectors.",
    "Our team of talented designers and architects work tirelessly to understand your unique needs and deliver solutions that exceed expectations. We believe that great design is a perfect blend of aesthetics, functionality, and emotional connection.",
    "From intimate home makeovers to large-scale institutional projects, we approach each assignment with the same level of dedication and creativity. Our portfolio speaks to our versatility and commitment to excellence."
  ]'::jsonb,
  '[
    {"number": "15+", "label": "Years of Excellence", "icon": "📅"},
    {"number": "30+", "label": "Expert Designers", "icon": "👥"},
    {"number": "98%", "label": "Client Satisfaction", "icon": "⭐"}
  ]'::jsonb,
  '[
    {"icon": "Award", "title": "Excellence", "description": "Committed to delivering the highest quality in every project"},
    {"icon": "Users", "title": "Collaboration", "description": "Working closely with clients to bring their vision to life"},
    {"icon": "Target", "title": "Innovation", "description": "Pushing boundaries with creative and modern design solutions"},
    {"icon": "Sparkles", "title": "Attention to Detail", "description": "Every element carefully crafted for perfection"}
  ]'::jsonb,
  true,
  0
);

