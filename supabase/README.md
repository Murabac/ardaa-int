# Supabase Migrations

This directory contains the SQL migration file for creating the `ardaa-int` schema in your multi-schema Supabase project.

## Required Migration

**001_create_ardaa_int_schema.sql** - Creates the `ardaa-int` schema and sets up basic permissions
- **This migration is required** - Run this first to create the schema
- After running this, create your tables as needed for your project

## Running Migrations

### Option 1: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste each migration file in order
4. Run each migration sequentially

### Option 2: Using Supabase CLI

If you have Supabase CLI installed:

```bash
# Link your project (if not already linked)
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### Option 3: Manual Execution

Execute each SQL file in order using your preferred database client or the Supabase SQL Editor.

## Schema Structure

The `ardaa-int` schema is created by the migration. After running it, create your tables as needed for your project.

When creating tables, consider:
- Setting up Row Level Security (RLS) policies
- Creating indexes for common queries
- Adding `created_at` and `updated_at` timestamps
- Using the schema-qualified table names: `"ardaa-int".your_table_name`

## Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:
- Public read access for public-facing data
- Authenticated users can manage content (for admin access)
- Contact submissions allow public inserts

## Notes

- All tables include `created_at` and `updated_at` timestamps
- The `updated_at` field is automatically updated via triggers
- Foreign key relationships are set up where applicable
- Indexes are created for common query patterns

