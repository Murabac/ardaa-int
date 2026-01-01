-- Create contact_info table in aradaa_int schema
CREATE TABLE IF NOT EXISTS "aradaa_int"."contact_info" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Contact Section Header
  contact_badge_text TEXT DEFAULT 'Get in Touch',
  contact_heading TEXT NOT NULL,
  contact_description TEXT,
  
  -- Phone Numbers
  phone_1 TEXT NOT NULL,
  phone_2 TEXT,
  
  -- Email Addresses
  email_1 TEXT NOT NULL,
  email_2 TEXT,
  
  -- Address (stored as JSON array for multiple lines)
  address_lines JSONB DEFAULT '[]'::jsonb,
  
  -- Business Hours (stored as JSON array: [{day, hours}])
  business_hours JSONB DEFAULT '[]'::jsonb,
  
  -- Footer Content
  footer_text TEXT, -- Text below footer logo
  
  -- Social Media Links (stored as JSON array: [{platform, url}])
  social_media_links JSONB DEFAULT '[]'::jsonb,
  
  -- Copyright Text
  copyright_text TEXT DEFAULT '© 2024 Ardaa Interior Firm. All rights reserved.',
  
  -- Display Settings
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_contact_info_is_active ON "aradaa_int"."contact_info"(is_active);
CREATE INDEX IF NOT EXISTS idx_contact_info_display_order ON "aradaa_int"."contact_info"(display_order);

-- Create trigger to update updated_at timestamp
DROP TRIGGER IF EXISTS update_contact_info_updated_at ON "aradaa_int"."contact_info";

CREATE TRIGGER update_contact_info_updated_at
  BEFORE UPDATE ON "aradaa_int"."contact_info"
  FOR EACH ROW
  EXECUTE FUNCTION "aradaa_int".update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE "aradaa_int"."contact_info" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Allow public read access to contact_info" ON "aradaa_int"."contact_info";
DROP POLICY IF EXISTS "Allow authenticated insert to contact_info" ON "aradaa_int"."contact_info";
DROP POLICY IF EXISTS "Allow authenticated update to contact_info" ON "aradaa_int"."contact_info";
DROP POLICY IF EXISTS "Allow authenticated delete to contact_info" ON "aradaa_int"."contact_info";

-- RLS Policies
-- Allow public read access to active contact info
CREATE POLICY "Allow public read access to contact_info"
  ON "aradaa_int"."contact_info"
  FOR SELECT
  USING (is_active = true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated insert to contact_info"
  ON "aradaa_int"."contact_info"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated update to contact_info"
  ON "aradaa_int"."contact_info"
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated delete to contact_info"
  ON "aradaa_int"."contact_info"
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert default contact info data
INSERT INTO "aradaa_int"."contact_info" (
  contact_badge_text,
  contact_heading,
  contact_description,
  phone_1,
  phone_2,
  email_1,
  email_2,
  address_lines,
  business_hours,
  footer_text,
  social_media_links,
  copyright_text,
  is_active,
  display_order
) VALUES (
  'Get in Touch',
  'Let''s Create Something Amazing Together',
  'Ready to transform your space? Reach out to us and let''s start your design journey',
  '+252 63 47492747',
  '+252 63 4289558',
  'info@ardaainterior.com',
  'contact@ardaainterior.com',
  '[
    "Burj Omaar, 6th floor",
    "26 June District",
    "Hargeisa, Somalia"
  ]'::jsonb,
  '[
    {"day": "Saturday - Thursday", "hours": "8:00 AM - 5:00 PM"},
    {"day": "Friday", "hours": "Closed"}
  ]'::jsonb,
  'Transforming spaces into masterpieces since 2010. Excellence in every design, passion in every project.',
  '[
    {"platform": "Facebook", "url": "#"},
    {"platform": "Instagram", "url": "#"},
    {"platform": "Twitter", "url": "#"},
    {"platform": "TikTok", "url": "#"}
  ]'::jsonb,
  '© 2024 Ardaa Interior Firm. All rights reserved.',
  true,
  0
);


