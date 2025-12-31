-- Create the ardaa-int schema
CREATE SCHEMA IF NOT EXISTS "ardaa-int";

-- Grant usage on schema to authenticated users (adjust based on your auth requirements)
GRANT USAGE ON SCHEMA "ardaa-int" TO authenticated;
GRANT USAGE ON SCHEMA "ardaa-int" TO anon;

-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES IN SCHEMA "ardaa-int" GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA "ardaa-int" GRANT SELECT ON TABLES TO anon;

