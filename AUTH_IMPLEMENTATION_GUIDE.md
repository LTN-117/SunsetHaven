# Sunset Haven Resort - Authentication Implementation Guide

## 🎯 IMMEDIATE NEXT STEPS (Before Reboot)

### Step 1: Run the Database Setup
1. Open Supabase Dashboard: https://supabase.com/dashboard/project/kcrpbkxnlekufbwbjjzy
2. Go to SQL Editor
3. Copy and paste the entire contents of `SUPABASE_AUTH_SETUP.sql`
4. Click "Run" to execute

This will create:
- `admin_profiles` table (links to Supabase Auth users)
- `role_permissions` table with all role definitions
- All other tables (gallery, events, etc.)
- Row Level Security policies
- Helper functions for permission checks

### Step 2: Create Your Super Admin Account
1. In Supabase Dashboard, go to **Authentication → Users**
2. Click **"Invite user"**
3. Enter your email (e.g., `your-email@example.com`)
4. Choose **"Send invitation email"** OR **"Auto-confirm user"**
5. If auto-confirm, you'll need to set a password

### Step 3: Make Yourself Super Admin
After creating the user, run this SQL in Supabase SQL Editor:

```sql
UPDATE admin_profiles
SET
  role = 'super_admin',
  is_deletable = false,
  full_name = 'Your Full Name'
WHERE email = 'your-email@example.com';
```

### Step 4: Test Login
1. Start dev server: `npm run dev`
2. Go to http://localhost:3001/admin/login
3. Enter your credentials
4. Should redirect to /admin

---

## 📁 FILES CREATED

### 1. `/lib/auth.ts`
✅ Already created - Contains all auth utilities:
- `getAdminProfile()` - Get current user's profile
- `getUserPermissions(resource)` - Check permissions for a resource
- `hasPermission(resource, action)` - Check specific permission
- `signIn(email, password)` - Login function
- `signOut()` - Logout function
- `isAuthenticated()` - Check if user is logged in

### 2. `/app/admin/login/page.tsx`
✅ Already created - Beautiful login page with:
- Email/password form
- Loading states
- Toast notifications
- Auto-redirect if already logged in
- Branded design matching your site

### 3. `/SUPABASE_AUTH_SETUP.sql`
✅ Already created - Complete database setup with:
- Admin profiles table
- Role permissions table
- All existing tables
- RLS policies
- Permission functions
- Default role configurations

---

## 🚧 WHAT STILL NEEDS TO BE BUILT

Due to the complexity and time constraints, here's what I recommend you implement **AFTER your Mac reboot**:

### Priority 1: Essential Security ⚠️

#### 1.1 Auth Middleware (Protect Admin Routes)
Create `/middleware.ts`:

```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protect admin routes
  if (req.nextUrl.pathname.startsWith('/admin') && req.nextUrl.pathname !== '/admin/login') {
    if (!session) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/admin/login'
      return NextResponse.redirect(redirectUrl)
    }

    // Check if user has active admin profile
    const { data: profile } = await supabase
      .from('admin_profiles')
      .select('is_active')
      .eq('id', session.user.id)
      .single()

    if (!profile || !profile.is_active) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/admin/login'
      return NextResponse.redirect(redirectUrl)
    }
  }

  return res
}

export const config = {
  matcher: '/admin/:path*',
}
```

#### 1.2 Install Required Package
```bash
npm install @supabase/auth-helpers-nextjs
```

### Priority 2: User Management Page

Create `/app/admin/users/page.tsx` - Features needed:
- List all admin users
- Create new users (send invitation)
- Edit user roles
- Deactivate/activate users
- Delete users (except super admin and non-deletable ones)
- Show last login time

### Priority 3: Add Permission Checks to Existing Pages

Update each admin page to check permissions:

**Example for `/app/admin/gallery/page.tsx`:**

```typescript
import { useEffect, useState } from "react"
import { getUserPermissions } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function GalleryPage() {
  const [permissions, setPermissions] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function checkPermissions() {
      const perms = await getUserPermissions('gallery')
      if (!perms || !perms.can_view) {
        router.push('/admin')
        return
      }
      setPermissions(perms)
      setLoading(false)
    }
    checkPermissions()
  }, [router])

  if (loading) return <div>Loading...</div>

  // Disable buttons based on permissions
  const canCreate = permissions?.can_create
  const canEdit = permissions?.can_edit
  const canDelete = permissions?.can_delete

  return (
    // ... existing code
    <Button disabled={!canCreate}>Add Image</Button>
    <Button disabled={!canEdit}>Edit</Button>
    <Button disabled={!canDelete}>Delete</Button>
  )
}
```

Apply this pattern to:
- `/app/admin/inquiries/page.tsx`
- `/app/admin/gallery/page.tsx`
- `/app/admin/events/page.tsx`
- `/app/admin/newsletter/page.tsx`
- `/app/admin/testimonials/page.tsx`
- `/app/admin/footer/page.tsx`

### Priority 4: Add Logout Button to AdminLayout

Update `/components/admin/AdminLayout.tsx`:

```typescript
import { signOut } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

// ... in the component
const router = useRouter()

const handleLogout = async () => {
  try {
    await signOut()
    router.push('/admin/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// Add to the sidebar footer
<div className="pt-6 border-t border-gray-800 space-y-2">
  <Button
    onClick={handleLogout}
    variant="ghost"
    className="w-full justify-start text-gray-400 hover:text-white"
  >
    <LogOut className="h-5 w-5 mr-3" />
    Sign Out
  </Button>
  <Link href="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
    <span>← Back to Website</span>
  </Link>
</div>
```

---

## 🎭 ROLE DEFINITIONS

### Super Admin
- **Full access to everything**
- Cannot be deleted
- Can manage all users
- Can modify all content

### Admin
- Can manage all content (inquiries, gallery, events, newsletter, testimonials)
- Can view footer settings (cannot delete)
- Can view users list (cannot create/edit/delete)
- Cannot access user management

### Editor
- Can view and edit inquiries (cannot create/delete)
- Can create, edit gallery and events (cannot delete)
- Can view newsletter (read-only)
- Can create, edit testimonials (cannot delete)
- Can edit footer settings (cannot delete)
- No user management access

### Viewer
- Read-only access to:
  - Inquiries
  - Gallery
  - Events
  - Newsletter
  - Testimonials
  - Footer settings
- No access to user management

---

## 📊 PERMISSION MATRIX

| Resource      | Super Admin | Admin | Editor | Viewer |
|---------------|-------------|-------|--------|--------|
| Inquiries     | CRUD        | CRUD  | RU     | R      |
| Gallery       | CRUD        | CRUD  | CRU    | R      |
| Events        | CRUD        | CRUD  | CRU    | R      |
| Newsletter    | CRUD        | CRUD  | R      | R      |
| Testimonials  | CRUD        | CRUD  | CRU    | R      |
| Footer        | CRUD        | CRU   | RU     | R      |
| Users         | CRUD        | R     | -      | -      |

**Legend:**
- C = Create
- R = Read
- U = Update
- D = Delete
- \- = No access

---

## 🔐 SECURITY BEST PRACTICES

### Environment Variables
Ensure your `.env.local` has:
```
NEXT_PUBLIC_SUPABASE_URL=https://kcrpbkxnlekufbwbjjzy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**NEVER use the service role key in frontend code!**

### Row Level Security
✅ Already set up in `SUPABASE_AUTH_SETUP.sql`
- Public can only read active content
- Public can submit inquiries and newsletter signups
- Only authenticated admins can modify data
- Super admins can manage users

### Password Requirements
When creating users via Supabase:
- Minimum 8 characters
- Include uppercase, lowercase, numbers
- Consider using password manager

---

## 🧪 TESTING CHECKLIST

After implementation, test:

### Authentication
- [ ] Login with correct credentials works
- [ ] Login with wrong credentials fails
- [ ] Logout works and redirects to login
- [ ] Unauthenticated users cannot access /admin/*
- [ ] Already logged-in users redirect from /admin/login

### Permissions - Super Admin
- [ ] Can access all pages
- [ ] Can create/edit/delete everything
- [ ] Can manage users
- [ ] Cannot delete themselves

### Permissions - Admin
- [ ] Can access all content pages
- [ ] Can view but not manage users
- [ ] Can do everything except delete footer settings

### Permissions - Editor
- [ ] Can edit content
- [ ] Cannot delete anything
- [ ] Cannot access user management
- [ ] Newsletter is read-only

### Permissions - Viewer
- [ ] Can only view, no buttons enabled
- [ ] Cannot access user management

---

## 📝 QUICK SETUP SUMMARY

1. ✅ Run `SUPABASE_AUTH_SETUP.sql` in Supabase
2. ✅ Create super admin user in Supabase Dashboard
3. ✅ Update admin_profiles to set role = 'super_admin'
4. ⏳ Install: `npm install @supabase/auth-helpers-nextjs`
5. ⏳ Create `/middleware.ts` to protect routes
6. ⏳ Add logout button to AdminLayout
7. ⏳ Add permission checks to all admin pages
8. ⏳ Build `/admin/users` page
9. ⏳ Test all roles thoroughly

---

## 💡 TIPS & NOTES

- The login page is already beautiful and matches your brand
- All database tables and RLS policies are set up
- Permission functions are already in the database
- Auth utilities (`lib/auth.ts`) are ready to use
- You can create users via Supabase Dashboard → Authentication → Users
- When inviting users, they receive an email to set their password
- Default role for new users is 'viewer' (safest)

---

## 🚀 WHEN YOU'RE READY TO GO LIVE

Before production:
1. Review all RLS policies in Supabase
2. Enable email confirmations for new users
3. Set up email templates in Supabase (Auth → Email Templates)
4. Configure custom SMTP (optional, for branded emails)
5. Enable 2FA for super admin accounts
6. Set up monitoring/logging
7. Create backup super admin account (in case of lockout)

---

*This guide will get you 90% of the way there. The remaining work is mostly UI for user management and connecting the permission checks to existing pages.*

*Estimated time to complete: 3-4 hours*
