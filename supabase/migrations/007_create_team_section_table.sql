-- Create team_section table in aradaa_int schema
CREATE TABLE IF NOT EXISTS "aradaa_int"."team_section" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Header
  badge_text TEXT DEFAULT 'Our Team',
  heading TEXT NOT NULL,
  description TEXT,
  
  -- Team Members (stored as JSON array: [{name, role, image, bio}])
  team_members JSONB DEFAULT '[]'::jsonb,
  
  -- Display Settings
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_team_section_is_active ON "aradaa_int"."team_section"(is_active);
CREATE INDEX IF NOT EXISTS idx_team_section_display_order ON "aradaa_int"."team_section"(display_order);

-- Create trigger to update updated_at timestamp
DROP TRIGGER IF EXISTS update_team_section_updated_at ON "aradaa_int"."team_section";

CREATE TRIGGER update_team_section_updated_at
  BEFORE UPDATE ON "aradaa_int"."team_section"
  FOR EACH ROW
  EXECUTE FUNCTION "aradaa_int".update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE "aradaa_int"."team_section" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Allow public read access to team_section" ON "aradaa_int"."team_section";
DROP POLICY IF EXISTS "Allow authenticated insert to team_section" ON "aradaa_int"."team_section";
DROP POLICY IF EXISTS "Allow authenticated update to team_section" ON "aradaa_int"."team_section";
DROP POLICY IF EXISTS "Allow authenticated delete to team_section" ON "aradaa_int"."team_section";

-- RLS Policies
-- Allow public read access to active team section
CREATE POLICY "Allow public read access to team_section"
  ON "aradaa_int"."team_section"
  FOR SELECT
  USING (is_active = true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated insert to team_section"
  ON "aradaa_int"."team_section"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated update to team_section"
  ON "aradaa_int"."team_section"
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated delete to team_section"
  ON "aradaa_int"."team_section"
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert default team section data
INSERT INTO "aradaa_int"."team_section" (
  badge_text,
  heading,
  description,
  team_members,
  is_active,
  display_order
) VALUES (
  'Our Team',
  'Meet the Experts',
  'Talented professionals dedicated to bringing your vision to life',
  '[
    {
      "name": "Ahmed Al-Mansoori",
      "role": "Lead Interior Designer",
      "image": "/images/Person 1.jpg",
      "bio": "15+ years of experience in luxury residential and commercial design"
    },
    {
      "name": "Fatima Al-Zahra",
      "role": "Senior Architect",
      "image": "/images/Person 2.jpg",
      "bio": "Specialist in modern Islamic architecture and mosque design"
    },
    {
      "name": "Omar Hassan",
      "role": "Project Director",
      "image": "/images/Person 3.jpg",
      "bio": "Expert in large-scale government and institutional projects"
    }
  ]'::jsonb,
  true,
  0
);

