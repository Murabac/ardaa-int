-- Setup Admin Permissions for All Tables
-- This migration ensures admin operations can be performed via service role
-- The service_role key bypasses RLS, but we ensure all grants are in place

-- Ensure the schema has proper permissions for service_role
GRANT USAGE ON SCHEMA "aradaa_int" TO service_role;

-- Grant all permissions on all existing tables in the schema
GRANT ALL ON ALL TABLES IN SCHEMA "aradaa_int" TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA "aradaa_int" TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA "aradaa_int" TO service_role;

-- Set default privileges for future tables/sequences/functions
ALTER DEFAULT PRIVILEGES IN SCHEMA "aradaa_int" 
  GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA "aradaa_int" 
  GRANT ALL ON SEQUENCES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA "aradaa_int" 
  GRANT ALL ON FUNCTIONS TO service_role;

-- Ensure RLS policies allow public read access (for frontend)
-- These policies are for regular users, service_role bypasses RLS

-- Hero Section Policies (recreate to ensure they exist)
DROP POLICY IF EXISTS "Allow public read access to hero_section" ON "aradaa_int"."hero_section";
DROP POLICY IF EXISTS "Allow authenticated users to insert hero_section" ON "aradaa_int"."hero_section";
DROP POLICY IF EXISTS "Allow authenticated users to update hero_section" ON "aradaa_int"."hero_section";
DROP POLICY IF EXISTS "Allow authenticated users to delete hero_section" ON "aradaa_int"."hero_section";

CREATE POLICY "Allow public read access to hero_section"
  ON "aradaa_int"."hero_section"
  FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to insert hero_section"
  ON "aradaa_int"."hero_section"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update hero_section"
  ON "aradaa_int"."hero_section"
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete hero_section"
  ON "aradaa_int"."hero_section"
  FOR DELETE
  TO authenticated
  USING (true);

-- Note: The service_role key used in the application code bypasses all RLS policies
-- This means admin operations using the service role will work regardless of these policies
-- These policies are for regular authenticated users (if using Supabase Auth)

