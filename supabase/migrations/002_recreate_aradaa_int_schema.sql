-- Drop the aradaa_int schema if it exists (CASCADE removes all objects in the schema)
DROP SCHEMA IF EXISTS "aradaa_int" CASCADE;

-- Recreate the aradaa_int schema
CREATE SCHEMA "aradaa_int";

-- Grant usage on schema to authenticated users
GRANT USAGE ON SCHEMA "aradaa_int" TO authenticated;
GRANT USAGE ON SCHEMA "aradaa_int" TO anon;

-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES IN SCHEMA "aradaa_int" GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA "aradaa_int" GRANT SELECT ON TABLES TO anon;


