# Ardaa Interior Firm - Website

A modern, responsive website for Ardaa Interior Firm, showcasing exceptional interior design services and portfolio.

## About Ardaa Interior Firm

Ardaa Interior Firm is a leading design studio specializing in creating exceptional interior spaces that inspire and delight. With over 15 years of experience, we've transformed hundreds of spaces across residential, commercial, government, and religious sectors.

Our commitment to excellence, attention to detail, and passion for design has established us as a trusted partner for clients seeking to elevate their living and working environments.

## Project Overview

This website serves as the digital presence for Ardaa Interior Firm, featuring:

- **Portfolio Showcase**: Display of completed projects across various sectors
- **Service Information**: Detailed descriptions of our design services
- **Company Information**: About us, team, and company values
- **Contact & Inquiry**: Easy-to-use contact forms and inquiry system
- **Project Gallery**: Visual showcase of our design work

## Technology Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React 18** - UI library
- **Supabase** - Backend as a Service (Database, Auth, Storage)

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm package manager
- Supabase account ([sign up here](https://supabase.com))

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key from the project settings
   - Create a `.env.local` file in the root directory:
   ```bash
   cp env.template .env.local
   ```
   - Fill in your Supabase credentials in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Build

Build the production version:

```bash
npm run build
npm start
```

## Project Structure

```
ardaa-int/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── globals.css         # Global styles
│   │   ├── about/              # About page
│   │   ├── services/           # Services page
│   │   ├── portfolio/          # Portfolio page
│   │   ├── contact/            # Contact page
│   │   └── api/                # API routes
│   ├── components/             # React components
│   │   ├── common/             # Reusable common components
│   │   │   ├── Button.tsx
│   │   │   └── Card.tsx
│   │   ├── layout/             # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   ├── sections/           # Page sections
│   │   │   ├── Hero.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── Portfolio.tsx
│   │   │   └── Contact.tsx
│   │   └── ui/                 # UI components
│   ├── types/                  # TypeScript type definitions
│   │   ├── index.ts
│   │   ├── project.ts
│   │   ├── service.ts
│   │   └── database.ts         # Supabase database types
│   ├── constants/              # Constants and configuration
│   │   ├── index.ts
│   │   ├── routes.ts
│   │   └── services.ts
│   ├── utils/                  # Utility functions
│   │   ├── index.ts
│   │   ├── format.ts
│   │   └── validation.ts
│   ├── hooks/                  # Custom React hooks
│   │   └── useMediaQuery.ts
│   ├── lib/                    # External library configs
│   │   └── supabase/           # Supabase client configuration
│   │       ├── client.ts       # Browser client
│   │       ├── server.ts       # Server client
│   │       └── middleware.ts   # Middleware utilities
│   ├── middleware.ts           # Next.js middleware
│   └── styles/                 # Additional stylesheets
│       ├── components.css
│       └── utilities.css
├── public/                     # Static assets
│   ├── images/                 # Image assets
│   ├── icons/                  # Icon assets
│   └── videos/                 # Video assets
├── supabase/                   # Supabase migrations
│   ├── migrations/             # SQL migration files
│   │   └── 001_create_ardaa_int_schema.sql
│   └── README.md               # Migration instructions
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
└── README.md
```

## Features

- Responsive design for all devices
- Modern UI/UX
- Portfolio gallery
- Service showcase
- Contact forms
- Project case studies

## Supabase Setup

### Using Supabase in Your Code

**Server Components** (Recommended for data fetching):
```typescript
import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const { data } = await supabase.from('projects').select('*')
  // ...
}
```

**Client Components**:
```typescript
'use client'
import { createClient } from '@/lib/supabase/client'

export default function Component() {
  const supabase = createClient()
  // Use supabase client here
}
```

**Helper Functions**:
Add your table-specific helper functions in `src/lib/supabase/helpers.ts` as you create tables.

All queries should use the `ardaa-int` schema via the `withSchema()` utility:
```typescript
import { withSchema } from '@/lib/supabase/schema'

const { data } = await supabase
  .from(withSchema('your_table_name'))
  .select('*')
```

### Database Schema

The project uses a multi-schema Supabase setup with the `ardaa-int` schema. 

**Schema Setup:**

1. Run the schema creation migration:
   - `001_create_ardaa_int_schema.sql` - Creates the `ardaa-int` schema and sets up permissions

2. You can run this migration via:
   - **Supabase Dashboard**: Copy and paste the file into the SQL Editor
   - **Supabase CLI**: Use `supabase db push` (if using CLI)

3. After creating the schema, create your tables as needed for your project.

**Tables in `ardaa-int` schema:**
Create tables as needed. Use the `withSchema()` utility when querying tables.

See `supabase/README.md` for detailed migration instructions.

### Generating TypeScript Types

To generate TypeScript types from your Supabase schema:

```bash
npx supabase gen types typescript --project-id <your-project-id> > src/types/database.ts
```

## Services

Ardaa Interior Firm specializes in:

- **Residential Design**: Custom home interiors and renovations
- **Commercial Design**: Office spaces, retail, and hospitality
- **Government Projects**: Public sector interior solutions
- **Religious Spaces**: Sacred and spiritual environment design

## Contributing

This is a private project for Ardaa Interior Firm.

## License

_To be determined_

## Contact

For inquiries about Ardaa Interior Firm, please contact us through the website's contact form.

---

© 2024 Ardaa Interior Firm. All rights reserved.

