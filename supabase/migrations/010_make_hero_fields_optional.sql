-- Set default values for removed hero section fields
-- These fields will always have the same default values when not provided

-- Set default for title_line2 (empty string so it doesn't break, but you can set a specific value)
ALTER TABLE "aradaa_int"."hero_section" 
  ALTER COLUMN title_line2 SET DEFAULT '';

-- title_line2_color already has a default, ensure it's set
ALTER TABLE "aradaa_int"."hero_section" 
  ALTER COLUMN title_line2_color SET DEFAULT '#E87842';

-- Button fields already have defaults, ensure they're set
ALTER TABLE "aradaa_int"."hero_section" 
  ALTER COLUMN primary_button_text SET DEFAULT '',
  ALTER COLUMN primary_button_action SET DEFAULT '',
  ALTER COLUMN secondary_button_text SET DEFAULT '',
  ALTER COLUMN secondary_button_action SET DEFAULT NULL;

-- Ready to start fields already have defaults, ensure they're set
ALTER TABLE "aradaa_int"."hero_section" 
  ALTER COLUMN ready_to_start_text SET DEFAULT '',
  ALTER COLUMN ready_to_start_button_text SET DEFAULT '',
  ALTER COLUMN ready_to_start_action SET DEFAULT '';

-- Update any existing NULL values to use defaults
UPDATE "aradaa_int"."hero_section"
SET 
  title_line2 = COALESCE(title_line2, ''),
  title_line2_color = COALESCE(title_line2_color, '#E87842'),
  primary_button_text = COALESCE(primary_button_text, ''),
  primary_button_action = COALESCE(primary_button_action, ''),
  secondary_button_text = COALESCE(secondary_button_text, ''),
  ready_to_start_text = COALESCE(ready_to_start_text, ''),
  ready_to_start_button_text = COALESCE(ready_to_start_button_text, ''),
  ready_to_start_action = COALESCE(ready_to_start_action, '')
WHERE id IS NOT NULL;

