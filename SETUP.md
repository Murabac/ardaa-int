# Setup Guide - Ardaa Interior Firm Website

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp env.template .env.local
```

Fill in your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set Up Supabase Database Schema

The project uses a multi-schema Supabase setup with the `ardaa-int` schema.

#### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open each migration file from `supabase/migrations/` in order:
   - `001_create_ardaa_int_schema.sql`
   - `002_create_projects_table.sql`
   - `003_create_services_table.sql`
   - `004_create_contact_submissions_table.sql`
   - `005_create_team_members_table.sql`
   - `006_create_testimonials_table.sql`
   - `007_insert_initial_data.sql`
4. Copy and paste each file's contents into the SQL Editor
5. Run each migration sequentially

#### Option B: Using Supabase CLI

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### 4. Verify Schema Setup

After running migrations, verify in Supabase Dashboard:
- Go to **Database** → **Schemas**
- You should see the `ardaa-int` schema
- Check that all tables are created:
  - projects
  - services
  - contact_submissions
  - team_members
  - testimonials

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Schema Notes

### Multi-Schema Support

The project uses the `ardaa-int` schema for all tables. The Supabase client helpers automatically prefix table names with the schema using the `withSchema()` utility function.

If you encounter issues with schema-qualified table names, you may need to:

1. **Set schema in Supabase Dashboard**: Go to Settings → API → Schema and ensure `ardaa-int` is included in the exposed schemas
2. **Update RLS policies**: Ensure your Row Level Security policies account for the schema
3. **Check API settings**: Verify that the schema is accessible via the API

### Testing the Setup

You can test the database connection by:

1. Creating a test project in the Supabase Dashboard
2. Using the helper functions in your code:
   ```typescript
   import { getProjects } from '@/lib/supabase/helpers'
   
   const projects = await getProjects()
   console.log(projects)
   ```

## Troubleshooting

### Schema Not Found Error

If you get "schema does not exist" errors:
- Verify migrations ran successfully
- Check that the schema name is exactly `ardaa-int` (case-sensitive)
- Ensure the schema is exposed in Supabase API settings

### RLS Policy Issues

If you get permission errors:
- Check Row Level Security policies in Supabase Dashboard
- Verify that public read policies are enabled for public-facing tables
- Ensure authenticated users have appropriate permissions

### Table Not Found

If queries fail with "relation does not exist":
- Verify the table exists in the `ardaa-int` schema
- Check that you're using the correct table name (case-sensitive)
- Ensure the `withSchema()` utility is being used in queries

## Next Steps

- Add your first project to the database
- Customize the service descriptions
- Add team member profiles
- Set up image storage in Supabase Storage (if needed)


