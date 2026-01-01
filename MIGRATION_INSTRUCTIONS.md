# Migration Instructions - Set Default Values for Hero Fields

## Problem
The hero section update is failing with a 500 error because the database has `title_line2` as `NOT NULL`, but the application no longer sends this field.

## Solution
Run the migration `010_make_hero_fields_optional.sql` to set default values for all removed fields. These fields will always have the same default values when not provided by the application.

## Steps to Apply Migration

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the file: `supabase/migrations/010_make_hero_fields_optional.sql`
4. Copy and paste the entire contents into the SQL Editor
5. Click **Run** to execute the migration

### Option 2: Using Supabase CLI

```bash
# If you have Supabase CLI installed
supabase db push
```

This will run all pending migrations including the new one.

## What This Migration Does

- Sets default value for `title_line2` (empty string `''`)
- Ensures `title_line2_color` has default `'#E87842'`
- Sets default values for all button fields (empty strings)
- Sets default values for all ready_to_start fields (empty strings)
- Updates any existing NULL values to use the defaults

## After Running the Migration

1. The hero section update should work without errors
2. When the application doesn't send these fields, they will automatically use the default values
3. All fields remain `NOT NULL` but now have defaults, so updates won't fail

## Verification

After running the migration, try updating the hero section again from the admin panel. The 500 error should be resolved, and the fields will always have consistent default values.

