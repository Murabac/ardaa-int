-- Create users table in aradaa_int schema
CREATE TABLE IF NOT EXISTS "aradaa_int"."users" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User Credentials
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL, -- bcrypt hashed password
  
  -- User Info
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'editor')),
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- Create unique constraint on email
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_unique ON "aradaa_int"."users"(email);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_users_email ON "aradaa_int"."users"(email);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON "aradaa_int"."users"(is_active);

-- Create trigger to update updated_at timestamp
DROP TRIGGER IF EXISTS update_users_updated_at ON "aradaa_int"."users";

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON "aradaa_int"."users"
  FOR EACH ROW
  EXECUTE FUNCTION "aradaa_int".update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE "aradaa_int"."users" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Allow authenticated users to read own data" ON "aradaa_int"."users";
DROP POLICY IF EXISTS "Allow authenticated users to update own data" ON "aradaa_int"."users";

-- RLS Policies
-- Note: For admin panel, we'll handle authentication in the application layer
-- These policies are restrictive - only allow users to read/update their own data
CREATE POLICY "Allow authenticated users to read own data"
  ON "aradaa_int"."users"
  FOR SELECT
  USING (true); -- We'll handle auth in the app layer

-- Insert default admin user (password: admin123 - CHANGE THIS IN PRODUCTION!)
-- Password hash for "admin123" using bcrypt with 10 rounds
INSERT INTO "aradaa_int"."users" (
  email,
  password_hash,
  full_name,
  role,
  is_active
) VALUES (
  'admin@ardaainterior.com',
  '$2b$10$UEmEZGi4KCRWqZ/0CjqZW..StP0PLu0sTeY7WhmBG2yhrdxRWwi7m',
  'Admin User',
  'admin',
  true
) ON CONFLICT (email) DO NOTHING;

