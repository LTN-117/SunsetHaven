# Sunset Haven Resort - Technical Stack & Architecture

## Technology Stack

### Frontend Framework
**Next.js 14.2.25**
- React 19.0.0
- App Router (not Pages Router)
- Server Components by default
- Client Components for interactivity
- Built-in optimization (images, fonts, scripts)
- API routes (not used in MVP)

### Language
**TypeScript 5.x**
- Type safety across entire codebase
- Interface definitions for database types
- Strict mode enabled
- TSConfig configured for Next.js

### Styling
**Tailwind CSS v4.0.0**
- Utility-first CSS framework
- Custom configuration
- JIT (Just-In-Time) compiler
- Dark theme by default
- Custom animations defined in globals.css

**PostCSS 8.x**
- CSS processing
- Autoprefixer
- Tailwind directives processing

###Component Library
**Shadcn UI**
- 60+ pre-built components
- Radix UI primitives
- Fully customizable
- Accessible by default
- Components used:
  - Button, Input, Label, Textarea
  - Select, Dialog, Card
  - Table, Badge, Tabs
  - Carousel (Embla-based)
  - And 50+ more

### Icons
**Lucide React 0.index**
- 1000+ icons
- Tree-shakeable
- Consistent design
- Icons used: Mail, Phone, MapPin, Instagram, Calendar, Truck, Users, Star, Inbox, Images, MessageSquare, Settings, Plus, Trash2, Eye, EyeOff, Edit, Filter, X, Menu, LayoutDashboard, TrendingUp, GripVertical, Quote

### Backend/Database
**Supabase**
- PostgreSQL 15 database
- RESTful API (auto-generated)
- Real-time subscriptions (not used in MVP)
- Row Level Security (RLS)
- Triggers and functions
- Hosted on Supabase cloud
- Free tier: 500MB database, 1GB file storage

**Supabase Client (@supabase/supabase-js)**
- JavaScript client library
- Type-safe queries
- Auth integration ready
- Storage API ready

### State Management
**React Hooks**
- useState for local state
- useEffect for side effects
- usePathname (Next.js) for routing
- No Redux/Zustand needed for MVP

### Form Handling
**React Hook Form 7.x** (installed but not fully integrated)
- Form validation
- Error handling
- Pending full integration

**Zod 3.x** (installed but not used yet)
- Schema validation
- Type inference
- Ready for form validation

### Date Handling
**date-fns 3.x**
- Lightweight date library
- Used for formatting timestamps
- Functions used: format()
- More performant than Moment.js

### Carousel
**Embla Carousel React**
- Lightweight carousel library
- Auto-play support
- Infinite loop
- Responsive
- Used in gallery and testimonials

### Analytics (Ready, not integrated)
**Google Analytics 4**
- NEXT_PUBLIC_GA_ID in env
- Pending script integration

**PostHog**
- NEXT_PUBLIC_POSTHOG_KEY in env
- Product analytics platform
- Event tracking
- Session recording
- Feature flags

### Charts (Installed, not used)
**Recharts 2.x**
- React charting library
- Ready for analytics dashboard
- Not used in MVP

### Table Library (Installed, not used)
**TanStack Table 8.x (React Table)**
- Headless table library
- Installed for potential advanced table features
- Currently using simple Shadcn Table

---

## Architecture

### Project Structure
```
┌─────────────────────────────────────┐
│         User Browser                │
│  (React Components + Tailwind)     │
└────────────┬────────────────────────┘
             │
             │ HTTP/HTTPS
             ▼
┌─────────────────────────────────────┐
│       Next.js Server                │
│   (Server Components + API)         │
└────────────┬────────────────────────┘
             │
             │ Supabase REST API
             ▼
┌─────────────────────────────────────┐
│      Supabase Cloud                 │
│  (PostgreSQL + Storage + Auth)      │
└─────────────────────────────────────┘
```

### Rendering Strategy
```
Page                    | Rendering Type
------------------------|------------------
Homepage (/)            | Server Component
Admin Dashboard         | Client Component (useState, useEffect)
Admin Pages             | Client Component (Supabase queries)
```

### Data Flow

**Frontend → Database:**
```
User Action
  ↓
React Event Handler
  ↓
Supabase Client Method (insert/update/delete)
  ↓
HTTP Request to Supabase REST API
  ↓
PostgreSQL Database
  ↓
Response (data or error)
  ↓
Update React State
  ↓
UI Re-render
```

**Database → Frontend:**
```
Page Load
  ↓
useEffect Hook
  ↓
Supabase Client Query (select)
  ↓
HTTP Request to Supabase REST API
  ↓
PostgreSQL Database
  ↓
Response (rows)
  ↓
setData(response.data)
  ↓
UI Render with Data
```

---

## Database Schema

### Tables (4)

**1. inquiries**
```sql
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  inquiry_type TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index on status for filtering
CREATE INDEX idx_inquiries_status ON inquiries(status);

-- Index on created_at for sorting
CREATE INDEX idx_inquiries_created_at ON inquiries(created_at DESC);
```

**2. gallery_images**
```sql
CREATE TABLE gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  caption TEXT DEFAULT '',
  category TEXT DEFAULT 'general',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_gallery_display_order ON gallery_images(display_order);
CREATE INDEX idx_gallery_is_active ON gallery_images(is_active);
```

**3. testimonials**
```sql
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_name TEXT NOT NULL,
  quote TEXT NOT NULL,
  guest_role TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_testimonials_display_order ON testimonials(display_order);
CREATE INDEX idx_testimonials_is_active ON testimonials(is_active);
```

**4. footer_settings**
```sql
CREATE TABLE footer_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT DEFAULT 'tarkwabaylifestyle@gmail.com',
  phone TEXT DEFAULT '+234 806 935 9028',
  address TEXT DEFAULT 'Tarkwa Bay Island, Lagos',
  additional_info TEXT DEFAULT '15 minutes by boat from Lagos',
  instagram_handle TEXT DEFAULT '@sunset.haven__',
  instagram_url TEXT DEFAULT 'https://instagram.com/sunset.haven__',
  availability_text TEXT DEFAULT 'Year-round availability',
  transport_text TEXT DEFAULT 'Boat transport available',
  copyright_text TEXT DEFAULT '© 2025 by Sunset Haven. Powered and secured by Vercel.',
  powered_by_text TEXT DEFAULT 'Powered and secured by Vercel',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default row
INSERT INTO footer_settings (id) VALUES (uuid_generate_v4());
```

### Triggers
```sql
-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_inquiries_updated_at
  BEFORE UPDATE ON inquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_footer_settings_updated_at
  BEFORE UPDATE ON footer_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Row Level Security (RLS)
```sql
-- Enable RLS on all tables
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_settings ENABLE ROW LEVEL SECURITY;

-- Policies (Open for MVP - TIGHTEN FOR PRODUCTION)
CREATE POLICY "Enable read access for all users"
  ON inquiries FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users"
  ON inquiries FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users"
  ON inquiries FOR UPDATE USING (true);

-- Similar policies for other tables...
```

**⚠️ SECURITY WARNING:** Current RLS policies allow public access. For production, implement proper authentication and restrict to authenticated admins only.

---

## TypeScript Types

### Supabase Database Types
```typescript
// lib/supabase.ts

export type Database = {
  public: {
    Tables: {
      inquiries: {
        Row: {
          id: string
          name: string
          phone: string
          inquiry_type: string
          message: string
          status: 'new' | 'read' | 'responded' | 'archived'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          inquiry_type: string
          message: string
          status?: 'new' | 'read' | 'responded' | 'archived'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          inquiry_type?: string
          message?: string
          status?: 'new' | 'read' | 'responded' | 'archived'
          created_at?: string
          updated_at?: string
        }
      }
      // ... other tables
    }
  }
}
```

### Component Props Types
```typescript
// Example from AdminLayout.tsx
interface AdminLayoutProps {
  children: ReactNode
}

// Example from inquiry types
interface Inquiry {
  id: string
  name: string
  phone: string
  inquiry_type: string
  message: string
  status: 'new' | 'read' | 'responded' | 'archived'
  created_at: string
  updated_at: string
}
```

---

## Environment Variables

### Required Variables
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...

# Admin Auth
ADMIN_PASSWORD=your-secure-password

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# GitHub (Local only)
GITHUB_PAT=ghp_xxxx
```

### Variable Naming Conventions
- `NEXT_PUBLIC_*` = Exposed to browser (use for client-side)
- No prefix = Server-side only (use for API keys)

---

## Build & Deployment

### Build Process
```bash
# Development build
npm run dev
→ Next.js starts dev server on :3000
→ Hot reload enabled
→ TypeScript checking
→ Tailwind JIT compilation

# Production build
npm run build
→ TypeScript compilation
→ Next.js optimization
→ Tailwind CSS purging (removes unused styles)
→ Image optimization
→ Bundle splitting
→ Code minification
→ Static generation (where possible)
→ Output: .next/ directory

# Start production server
npm run start
→ Serves optimized build
→ No hot reload
→ Production performance
```

### Build Output
```
.next/
├── cache/                 # Build cache
├── server/                # Server-side code
│   ├── app/              # App router pages
│   └── chunks/           # Code chunks
├── static/               # Static assets
│   ├── chunks/          # JS bundles
│   ├── css/             # CSS files
│   └── media/           # Images, fonts
└── BUILD_ID              # Unique build identifier
```

### Bundle Size (Estimated)
```
First Load JS:
├── Shared chunks: ~300 KB
├── Homepage: ~50 KB
├── Admin pages: ~100 KB each
└── Total: ~500 KB (gzipped: ~150 KB)

CSS:
└── Tailwind (purged): ~20 KB

Images:
└── 26 images: ~15 MB (unoptimized)
    Next.js optimizes on-demand
```

---

## Performance Optimizations

### Implemented
- [x] Next.js Image component for optimization
- [x] Lazy loading images (native loading="lazy")
- [x] Code splitting (automatic with Next.js)
- [x] CSS purging (Tailwind removes unused styles)
- [x] Minification (production build)
- [x] Compression (gzip/brotli via Vercel)

### Pending
- [ ] WebP/AVIF image format conversion
- [ ] CDN for images (Cloudinary/Cloudflare)
- [ ] Service worker (PWA)
- [ ] Prefetching critical routes
- [ ] Database query optimization
- [ ] Redis caching layer

---

## Security Measures

### Implemented
- [x] Environment variables for secrets
- [x] .gitignore for .env.local
- [x] HTTPS (enforced by Vercel)
- [x] CORS (configured by Supabase)
- [x] SQL injection protection (Supabase client)
- [x] XSS protection (React escaping)

### Pending (CRITICAL)
- [ ] Admin authentication (NO AUTH CURRENTLY!)
- [ ] RLS policies (currently too open)
- [ ] Rate limiting on forms
- [ ] CAPTCHA on contact form
- [ ] Content Security Policy (CSP) headers
- [ ] Input sanitization
- [ ] File upload validation
- [ ] Session management
- [ ] CSRF tokens

**⚠️ SECURITY WARNING:** Admin is currently publicly accessible. Implement authentication before deploying to production!

---

## Testing

### Current Status
- No automated tests implemented
- Manual testing performed during development

### Testing Strategy (Recommended)
```
Unit Tests (Jest + React Testing Library)
├── Component tests
├── Utility function tests
└── Hook tests

Integration Tests (Playwright/Cypress)
├── Form submissions
├── CRUD operations
├── Navigation flows
└── Admin workflows

E2E Tests (Playwright)
├── Full user journeys
├── Cross-browser testing
└── Mobile testing
```

---

## Monitoring & Logging

### Current Status
- Console.log for errors
- No structured logging
- No error tracking

### Recommended Setup
```
Error Tracking: Sentry
├── Client-side errors
├── Server-side errors
├── Performance monitoring
└── Release tracking

Logging: Vercel Analytics
├── Page views
├── API routes
├── Build logs
└── Function logs

Analytics: GA4 + PostHog
├── User behavior
├── Conversion tracking
├── Event tracking
└── Funnel analysis
```

---

## Development Tools

### IDE/Editor
- VS Code (recommended)
- TypeScript language server
- ESLint extension
- Prettier extension
- Tailwind CSS IntelliSense

### Package Manager
- npm (currently used)
- pnpm supported
- Yarn supported

### Git
- Git 2.x
- GitHub for hosting
- Main branch for production
- Feature branches recommended

### Browser DevTools
- React DevTools
- Redux DevTools (if added)
- Network tab for API debugging
- Lighthouse for performance audits

---

## Dependencies

### Production Dependencies (20)
```json
{
  "@supabase/supabase-js": "^2.x",
  "@tanstack/react-table": "^8.x",
  "date-fns": "^3.x",
  "embla-carousel-react": "^8.x",
  "lucide-react": "^0.x",
  "next": "14.2.25",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "react-hook-form": "^7.x",
  "recharts": "^2.x",
  "zod": "^3.x",
  // ... and others
}
```

### Dev Dependencies (10)
```json
{
  "@types/node": "^20.x",
  "@types/react": "^19.x",
  "@types/react-dom": "^19.x",
  "eslint": "^8.x",
  "eslint-config-next": "14.2.25",
  "postcss": "^8.x",
  "tailwindcss": "^4.x",
  "typescript": "^5.x"
}
```

### Total Package Size
- node_modules: ~500 MB
- Dependencies: 1,500+ packages (including transitive)

---

## API Integration Points

### Supabase REST API
```
Base URL: https://[project-ref].supabase.co/rest/v1

Endpoints:
├── GET    /inquiries          (list inquiries)
├── POST   /inquiries          (create inquiry)
├── PATCH  /inquiries?id=eq.X  (update inquiry)
├── DELETE /inquiries?id=eq.X  (delete inquiry)
├── GET    /gallery_images     (list images)
├── POST   /gallery_images     (add image)
├── PATCH  /gallery_images?id=eq.X
├── DELETE /gallery_images?id=eq.X
├── GET    /testimonials
├── POST   /testimonials
├── PATCH  /testimonials?id=eq.X
├── DELETE /testimonials?id=eq.X
├── GET    /footer_settings    (get settings)
└── PATCH  /footer_settings?id=eq.X  (update settings)

Headers:
├── apikey: [anon-key]
├── Authorization: Bearer [anon-key]
└── Content-Type: application/json
```

### Future API Integrations (Pending)
- Google Analytics API (reporting)
- PostHog API (event tracking)
- Email service API (SendGrid/Resend)
- Payment gateway (Paystack)
- WhatsApp Business API

---

## Scalability Considerations

### Current Capacity
```
Supabase Free Tier:
├── Database: 500 MB
├── Storage: 1 GB
├── Bandwidth: 5 GB/month
├── Requests: Unlimited
└── Concurrent connections: 60

Vercel Free Tier:
├── Bandwidth: 100 GB/month
├── Serverless function executions: 100 GB-hours
├── Build time: 6000 minutes/month
└── Deployments: Unlimited
```

### When to Scale Up
```
Database:
├── > 500 MB data → Upgrade Supabase ($25/mo for 8 GB)
├── > 60 concurrent users → Upgrade Supabase
└── Complex queries slow → Add indexes or read replicas

Frontend:
├── > 100 GB bandwidth → Upgrade Vercel ($20/mo for 1 TB)
├── > 1000 daily users → Consider CDN
└── Large images → Use image CDN (Cloudinary)
```

---

## Code Quality Standards

### Linting
```bash
# Run ESLint
npm run lint

# ESLint config
extends: "next/core-web-vitals"
```

### Formatting
- Prettier (recommended, not enforced)
- 2-space indentation
- Single quotes for strings
- Semicolons required

### TypeScript
- Strict mode enabled
- No implicit any
- All props typed
- Database types generated

### Naming Conventions
```
Files: kebab-case (admin-layout.tsx)
Components: PascalCase (AdminLayout)
Functions: camelCase (loadInquiries)
Variables: camelCase (isLoading)
Constants: UPPER_SNAKE_CASE (ADMIN_PASSWORD)
Types/Interfaces: PascalCase (Inquiry, AdminLayoutProps)
```

---

**Last Updated:** 2025-10-24
**Tech Stack Version:** 1.0.0
**Next.js Version:** 14.2.25
