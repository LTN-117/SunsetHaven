# Environment Variables Setup

This document provides a quick reference for all required environment variables.

## Required Variables

### 1. NEXT_PUBLIC_SUPABASE_URL
- **Description**: Your Supabase project URL
- **Where to find**:
  1. Go to your Supabase dashboard
  2. Click "Settings" → "API"
  3. Copy the "Project URL"
- **Example**: `https://kcrpbkxnlekufbwbjjzy.supabase.co`

### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Description**: Supabase anonymous/public key for client-side operations
- **Where to find**:
  1. Go to your Supabase dashboard
  2. Click "Settings" → "API"
  3. Copy the "anon public" key
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Note**: Safe to expose on the client-side

### 3. SUPABASE_SERVICE_ROLE_KEY
- **Description**: Supabase service role key for server-side admin operations
- **Where to find**:
  1. Go to your Supabase dashboard
  2. Click "Settings" → "API"
  3. Copy the "service_role" key
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **⚠️ CRITICAL**:
  - NEVER commit this to git
  - NEVER expose on the client-side
  - Only use in API routes or server components
  - Required for creating admin users

## Optional Variables

### 4. NEXT_PUBLIC_GA_ID (Optional)
- **Description**: Google Analytics 4 Measurement ID
- **Where to find**:
  1. Go to Google Analytics dashboard
  2. Admin → Data Streams → Your web stream
  3. Copy the "Measurement ID"
- **Example**: `G-XXXXXXXXXX`

### 5. NEXT_PUBLIC_POSTHOG_KEY (Optional)
- **Description**: PostHog project API key
- **Where to find**:
  1. Go to PostHog dashboard
  2. Project Settings → Project API Key
- **Example**: `phc_xxxxxxxxxxxxx`

### 6. NEXT_PUBLIC_POSTHOG_HOST (Optional)
- **Description**: PostHog instance URL
- **Default**: `https://app.posthog.com`

## .env.local Template

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Supabase Service Role Key (Required - KEEP SECRET!)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

## Vercel Deployment

When deploying to Vercel, add these environment variables in:

1. Go to your Vercel project
2. Settings → Environment Variables
3. Add each variable:
   - Variable name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: (your actual value)
   - Environment: Production, Preview, Development

Repeat for all required variables.

## Security Best Practices

1. ✅ **DO**:
   - Store `.env.local` in `.gitignore`
   - Use `.env.local.example` for documentation
   - Rotate keys if accidentally exposed
   - Use different keys for development and production

2. ❌ **DON'T**:
   - Commit `.env.local` to git
   - Share service role key with anyone
   - Use production keys in development
   - Expose service role key on the client-side

## Troubleshooting

### Error: "Invalid API key"
- Double-check your Supabase URL and anon key
- Ensure no extra spaces or quotes in `.env.local`
- Restart the dev server after adding variables

### Error: "User not allowed" when creating admin users
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is set
- Verify you're using the service role key, not the anon key
- Check that the API route at `/api/admin/create-user` exists

### Changes not reflecting
- Restart the development server: `npm run dev`
- Clear `.next` folder: `rm -rf .next`
- Check that variable names match exactly (case-sensitive)

## Current Configuration

Your current `.env.local` file contains:

```
✅ NEXT_PUBLIC_SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
✅ SUPABASE_SERVICE_ROLE_KEY
⚠️  NEXT_PUBLIC_GA_ID (placeholder)
⚠️  NEXT_PUBLIC_POSTHOG_KEY (placeholder)
⚠️  NEXT_PUBLIC_POSTHOG_HOST (placeholder)
```

The analytics variables are optional and can be updated when you're ready to add tracking.
