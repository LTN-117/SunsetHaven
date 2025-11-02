# Sunset Haven Resort

A luxury resort website with comprehensive admin backoffice for managing content, events, inquiries, and more.

## Features

- **Public Website**: Showcase resort experiences, events, gallery, and testimonials
- **Admin Dashboard**: Complete backoffice for content management
- **Role-Based Access Control**: Support for viewer, editor, admin, and super_admin roles
- **Events Management**: Multi-tier pricing system with Paystack integration
- **Gallery Management**: Image tagging system for organizing content
- **User Management**: Admin user creation and role assignment (super_admin only)
- **Newsletter Signups**: Collect and manage newsletter subscribers
- **Inquiries System**: Track and manage customer inquiries
- **Microsoft Clarity Analytics**: Track user behavior on frontend and admin

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payment**: Paystack
- **Analytics**: Microsoft Clarity

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Supabase Service Role Key (Required for admin operations - KEEP SECRET!)
# This is used for server-side operations like creating users
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### Where to find these values:

1. **Supabase URL & Anon Key**:
   - Go to your Supabase project dashboard
   - Click on "Settings" → "API"
   - Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy `anon/public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. **Supabase Service Role Key**:
   - Same location as above (Settings → API)
   - Copy `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`
   - ⚠️ **NEVER commit this to git or expose it publicly!**

3. **Analytics** (Optional):
   - Google Analytics: Get your GA4 measurement ID
   - PostHog: Sign up at posthog.com and get your project key

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Supabase Database

Run the SQL scripts in order:

1. `sql-scripts/COMPLETE_DATABASE_SETUP.sql` - Creates all tables
2. `sql-scripts/SUPABASE_AUTH_SETUP.sql` - Sets up authentication
3. `sql-scripts/SETUP_ROLE_PERMISSIONS.sql` - Configures role permissions
4. `sql-scripts/SETUP_STORAGE.sql` - Sets up file storage
5. `sql-scripts/dummy-data.sql` - (Optional) Adds sample data

### 3. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` with your actual Supabase credentials.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Access Admin Dashboard

Go to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

**First-time setup**: You need to create a super admin user directly in Supabase:

1. Go to Supabase → Authentication → Users
2. Add a new user with your email and password
3. Go to Table Editor → `admin_profiles`
4. Create a new row with:
   - `id`: (copy the user ID from auth.users)
   - `full_name`: Your name
   - `role`: `super_admin`
   - `is_active`: `true`

## User Roles

- **viewer**: Read-only access to all content (except users)
- **editor**: Can edit existing content (except users)
- **admin**: Full CRUD on all content (except users)
- **super_admin**: Full access including user management

## Project Structure

```
sunset-haven-resort/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   └── page.tsx           # Public homepage
├── components/            # React components
│   ├── admin/            # Admin-specific components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utility functions
│   ├── supabase.ts       # Supabase client
│   └── auth.ts           # Authentication helpers
├── public/                # Static assets
├── docs/                  # Documentation files
├── sql-scripts/          # Database setup scripts
└── .env.local            # Environment variables (not in git)
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy!

The `.vercelignore` file ensures only necessary files are deployed.

## Key Features

### Events System
- Multi-tier pricing (Early Bird, Regular, VIP, etc.)
- Flier upload and display
- Paystack payment integration
- Active/inactive toggle

### Gallery Management
- Image tagging for "What We've Built" cards
- Single-tag enforcement for special tags
- Drag-and-drop ordering
- Active/inactive toggle

### Newsletter System
- Email collection
- Export to CSV
- Integration with events section

### User Management (Super Admin Only)
- Create new admin users
- Assign roles
- Activate/deactivate accounts

## Documentation

- `/docs/GIT_GUIDE.md` - Git workflow and best practices
- `/docs/SETUP_INSTRUCTIONS.md` - Detailed setup guide
- `/docs/AUTH_IMPLEMENTATION_GUIDE.md` - Authentication details
- `/docs/INSTAGRAM_WIDGET_SETUP.md` - Instagram integration
- `/docs/PROJECT_STATUS.md` - Project status and features

## Support

For issues or questions, please check the documentation in the `/docs` folder or create an issue on GitHub.

## License

Private project - All rights reserved.
