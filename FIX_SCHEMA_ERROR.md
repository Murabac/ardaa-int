# How to Fix "Could not access ardaa-int schema" Error

This error occurs when the `ardaa-int` schema either:
1. Doesn't exist in your database, OR
2. Exists but is not exposed in Supabase API settings

## Solution: Two-Step Fix

### Step 1: Create the Schema

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor** (in the left sidebar)
3. Click **New Query**
4. Copy the entire contents of `supabase/migrations/001_create_ardaa_int_schema.sql`
5. Paste it into the SQL Editor
6. Click **Run** (or press Ctrl+Enter / Cmd+Enter)

The migration will create the `ardaa-int` schema with proper permissions.

### Step 2: Expose the Schema in API Settings

1. In your **Supabase Dashboard**, go to **Settings** (gear icon in left sidebar)
2. Click on **API** in the settings menu
3. Scroll down to the **Schema** section
4. In the **Exposed schemas** field, you should see `public` listed
5. Add `ardaa-int` to the list (separate multiple schemas with commas)
   - It should look like: `public, ardaa-int` or `public,ardaa-int`
6. Click **Save**

### Step 3: Verify

1. Go back to your test page: `http://localhost:3000/test-db`
2. Click **Run Tests Again**
3. You should now see:
   - ✅ ardaa-int schema exists
   - ✅ ardaa-int schema is accessible via API

## Alternative: Using Supabase CLI

If you have Supabase CLI installed:

```bash
# Link your project (if not already linked)
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

Then still complete **Step 2** above to expose the schema in API settings.

## Why This Is Needed

Supabase uses PostgREST to expose your database via API. By default, only the `public` schema is exposed. Custom schemas like `ardaa-int` need to be explicitly added to the exposed schemas list in the API settings.

## Troubleshooting

- **Schema still not accessible after Step 2?**
  - Make sure you saved the API settings
  - Wait a few seconds for changes to propagate
  - Check that the schema name is exactly `ardaa-int` (case-sensitive, with hyphen)

- **Migration fails?**
  - Check that you have proper permissions in Supabase
  - Verify you're connected to the correct project
  - Check the SQL Editor for any error messages


