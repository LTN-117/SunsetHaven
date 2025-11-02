# Sunset Haven Resort - Admin Backoffice Setup Guide

## Overview
Your admin backoffice is now built and ready to use! This guide will help you set up Supabase and get everything running.

## What's Been Built

### Admin Pages
1. **Dashboard** (`/admin`) - Overview with metrics and quick actions
2. **Inquiries** (`/admin/inquiries`) - View and manage contact form submissions
3. **Gallery** (`/admin/gallery`) - Upload and manage gallery images
4. **Testimonials** (`/admin/testimonials`) - Create and manage testimonials
5. **Footer Settings** (`/admin/footer`) - Edit all footer content

### Features
- Dark theme matching your frontend
- Neon border animations
- Real-time data from Supabase
- Mobile-responsive sidebar navigation
- Status management for inquiries
- Active/inactive toggle for gallery and testimonials
- Live preview for footer settings

## Setup Instructions

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in:
   - **Name**: Sunset Haven Resort
   - **Database Password**: (create a secure password - save it!)
   - **Region**: Choose closest to Nigeria (eu-west-1 or similar)
5. Click "Create new project" and wait 2-3 minutes

### Step 2: Run the Database Schema

1. In your Supabase project, go to **SQL Editor** (left sidebar)
2. Click "New Query"
3. Open the file `/Users/olamide/Desktop/Vibe coding/sunset-haven-resort/supabase-schema.sql`
4. Copy ALL the SQL code
5. Paste it into the Supabase SQL Editor
6. Click "Run" at the bottom right
7. You should see "Success. No rows returned" - this is correct!

### Step 3: Get Your Supabase Credentials

1. In Supabase, go to **Project Settings** (gear icon in sidebar)
2. Click **API** in the left menu
3. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

### Step 4: Update Environment Variables

1. Open `.env.local` in your project
2. Replace the placeholder values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here

# Admin Authentication
ADMIN_PASSWORD=your-secure-password-here

# Analytics (Optional - set these up later)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

3. Save the file

### Step 5: Test Your Admin

1. Start your development server (if not already running):
   ```bash
   cd "/Users/olamide/Desktop/Vibe coding/sunset-haven-resort"
   npm run dev
   ```

2. Open your browser and go to: `http://localhost:3000/admin`

3. You should see the admin dashboard with:
   - Stats cards showing 0 inquiries, 0 images, 0 testimonials
   - Quick action buttons
   - Sidebar navigation

### Step 6: Test Each Page

**Test Gallery:**
1. Go to `/admin/gallery`
2. Click "Add Image"
3. Try adding one of your existing images:
   - Image URL: `/premium-camping.jpg`
   - Caption: `Luxury camping experience`
   - Category: `camping`
4. Click "Add Image"
5. You should see the image appear in the grid

**Test Testimonials:**
1. Go to `/admin/testimonials`
2. Click "Add Testimonial"
3. Fill in:
   - Guest Name: `Sarah Johnson`
   - Guest Role: `Corporate Event Organizer`
   - Quote: `An unforgettable experience! Perfect for our team retreat.`
4. Click "Add Testimonial"
5. You should see the testimonial card appear

**Test Footer Settings:**
1. Go to `/admin/footer`
2. Update any field (e.g., phone number)
3. Click "Save Changes"
4. Check the preview section below

**Test Inquiries:**
- This will work once you connect your contact form (next step)

## Next Steps

### 1. Connect Contact Form to Supabase

Update your contact form in `app/page.tsx` to save submissions to Supabase instead of just console.log:

```typescript
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault()
  setIsSubmitting(true)

  try {
    const { error } = await supabase
      .from('inquiries')
      .insert([{
        name: formData.name,
        phone: formData.phone,
        inquiry_type: formData.inquiryType,
        message: formData.message,
      }])

    if (error) throw error

    alert('Thank you! We will get back to you soon.')
    setFormData({ name: '', phone: '', inquiryType: '', message: '' })
  } catch (error) {
    console.error('Error submitting form:', error)
    alert('Something went wrong. Please try again.')
  } finally {
    setIsSubmitting(false)
  }
}
```

### 2. Add Authentication

The admin currently has no authentication. To add password protection:

1. Create `/app/admin/login/page.tsx`
2. Use the `ADMIN_PASSWORD` from `.env.local`
3. Store session in localStorage or cookies
4. Add middleware to protect admin routes

Or use Supabase Auth for proper user authentication.

### 3. Load Dynamic Data on Frontend

Update your homepage to load:
- Gallery images from Supabase
- Testimonials from Supabase
- Footer settings from Supabase

This way, changes in the admin will reflect on the frontend immediately.

### 4. Set Up Analytics

**Google Analytics:**
1. Create a GA4 property at [analytics.google.com](https://analytics.google.com)
2. Get your Measurement ID (starts with G-)
3. Add it to `.env.local`

**PostHog:**
1. Sign up at [posthog.com](https://posthog.com)
2. Get your project API key
3. Add it to `.env.local`

## Troubleshooting

**"Failed to fetch" error:**
- Check your Supabase credentials in `.env.local`
- Make sure your Supabase project is active
- Check if the tables were created (go to Supabase > Table Editor)

**Changes not saving:**
- Open browser console (F12) to see errors
- Check Supabase RLS policies are correct
- Verify your anon key has the right permissions

**Images not loading in Gallery:**
- Make sure image URLs are correct
- For local images, use `/image-name.jpg`
- For external images, use full `https://` URLs

## File Structure

```
sunset-haven-resort/
├── app/
│   ├── admin/
│   │   ├── page.tsx              # Dashboard
│   │   ├── inquiries/
│   │   │   └── page.tsx          # Inquiries inbox
│   │   ├── gallery/
│   │   │   └── page.tsx          # Gallery manager
│   │   ├── testimonials/
│   │   │   └── page.tsx          # Testimonials manager
│   │   └── footer/
│   │       └── page.tsx          # Footer settings
│   └── page.tsx                   # Main homepage
├── components/
│   └── admin/
│       └── AdminLayout.tsx        # Admin sidebar layout
├── lib/
│   └── supabase.ts                # Supabase client
├── supabase-schema.sql            # Database schema
├── .env.local                     # Environment variables
└── .env.local.example             # Template for env vars
```

## Need Help?

If you run into any issues:
1. Check the browser console (F12) for error messages
2. Check Supabase logs in your project dashboard
3. Verify all environment variables are set correctly
4. Make sure the database schema was run successfully

## What's Next?

Your admin backoffice MVP is complete! You can now:
- ✅ View contact form submissions
- ✅ Manage gallery images
- ✅ Add/edit testimonials
- ✅ Update footer content
- ✅ See metrics on the dashboard

Consider adding:
- Admin authentication/login
- User roles and permissions
- Email notifications for new inquiries
- Image upload to Supabase Storage
- Content scheduling
- Analytics dashboard
