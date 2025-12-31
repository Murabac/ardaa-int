# How to Recreate the aradaa_int Schema

This guide will help you delete and recreate the `aradaa_int` schema in Supabase.

## ⚠️ Warning

**Dropping the schema will delete ALL tables, data, and objects in the `aradaa_int` schema!** Make sure you have a backup if you have important data.

## Steps to Recreate the Schema

### Option 1: Using the Migration File (Recommended)

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor** (in the left sidebar)
3. Click **New Query**
4. Copy the **entire contents** of `supabase/migrations/002_recreate_aradaa_int_schema.sql`
5. Paste it into the SQL Editor
6. Click **Run** (or press Ctrl+Enter / Cmd+Enter)

This will:
- Drop the existing `ardaa-int` schema (if it exists) and all its contents
- Create a fresh `ardaa-int` schema
- Set up proper permissions for authenticated and anon users

### Option 2: Manual SQL Execution

If you prefer to run the SQL manually, here's what to execute:

```sql
-- Step 1: Drop the schema (removes everything)
DROP SCHEMA IF EXISTS "aradaa_int" CASCADE;

-- Step 2: Create the schema
CREATE SCHEMA "aradaa_int";

-- Step 3: Grant permissions
GRANT USAGE ON SCHEMA "aradaa_int" TO authenticated;
GRANT USAGE ON SCHEMA "aradaa_int" TO anon;

-- Step 4: Set default privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA "aradaa_int" GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA "aradaa_int" GRANT SELECT ON TABLES TO anon;
```

## After Recreating the Schema

1. **Verify the schema exists:**
   - Go to **Database** → **Schemas** in Supabase Dashboard
   - You should see `aradaa_int` in the list

2. **Verify it's exposed in API settings:**
   - Go to **Settings** → **API** → **Schema**
   - Make sure `aradaa_int` is in the **Exposed schemas** list
   - If not, add it and click **Save**

3. **Test the connection:**
   - Visit `http://localhost:3000/test-db` in your app
   - Click **Run Tests Again**
   - You should see:
     - ✅ aradaa_int schema exists
     - ✅ aradaa_int schema is accessible via API

## What Gets Deleted

When you run `DROP SCHEMA CASCADE`, the following will be removed:
- All tables in the `aradaa_int` schema
- All data in those tables
- All functions, triggers, views, and other database objects
- All indexes and constraints

## What Gets Created

A fresh `aradaa_int` schema with:
- Proper permissions for authenticated users
- Proper permissions for anonymous users
- Default privileges for future tables

## Next Steps

After recreating the schema, you can:
- Create your tables (projects, services, contact_submissions, etc.)
- Run any additional migrations you need
- Start using the schema in your application

