# Sunset Haven Resort - Quick Start Guide

**⏱️ Time to Production: 2-3 hours**

This guide will get you from code to live website in the fastest time possible.

---

## Prerequisites Checklist

Before you start, make sure you have:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Git installed (`git --version`)
- [ ] Code editor (VS Code recommended)
- [ ] Web browser (Chrome/Firefox/Safari)
- [ ] Email account for Supabase
- [ ] GitHub account (already have it)

**Time Required:** If all prerequisites are met, proceed. Otherwise, install missing items first.

---

## Step 1: Verify Local Setup (5 minutes)

### 1.1 Check Project Files
```bash
cd "/Users/olamide/Desktop/Vibe coding/sunset-haven-resort"
ls
```

**Expected Output:**
You should see folders like `app/`, `components/`, `public/`, etc.

### 1.2 Check Dependencies
```bash
npm list --depth=0
```

**Expected:** Should show installed packages. If error, run:
```bash
npm install --legacy-peer-deps
```

### 1.3 Start Dev Server
```bash
npm run dev
```

**Expected Output:**
```
✓ Ready in 3.6s
- Local:        http://localhost:3000
```

### 1.4 Test Website
Open browser: http://localhost:3000

**Expected:** You should see the dark Sunset Haven homepage with hero section.

### 1.5 Test Admin (NO AUTH WARNING!)
Open: http://localhost:3000/admin

**Expected:** You should see admin dashboard with stat cards showing zeros.

**Status Check:**
- ✅ If everything works → Proceed to Step 2
- ❌ If errors → Check console for error messages and fix

---

## Step 2: Set Up Supabase (15 minutes)

### 2.1 Create Account
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub (fastest)

### 2.2 Create Project
1. Click "New Project"
2. Fill in:
   - **Organization:** Personal (or create new)
   - **Name:** `sunset-haven-resort`
   - **Database Password:** Create strong password (SAVE THIS!)
   - **Region:** `West EU (London)` or closest to Nigeria
   - **Pricing Plan:** Free
3. Click "Create new project"
4. **Wait 2-3 minutes** for project to initialize
5. You'll see "Project is ready" with green checkmark

### 2.3 Run Database Schema
1. In Supabase dashboard, click "SQL Editor" (left sidebar)
2. Click "New Query"
3. Open file on your computer:
   ```
   /Users/olamide/Desktop/Vibe coding/sunset-haven-resort/supabase-schema.sql
   ```
4. Copy ALL the SQL (Cmd+A, Cmd+C)
5. Paste into Supabase SQL Editor
6. Click "Run" (bottom right)
7. **Expected:** "Success. No rows returned" message

**Verify Tables Created:**
1. Click "Table Editor" (left sidebar)
2. You should see 4 tables:
   - inquiries
   - gallery_images
   - testimonials
   - footer_settings

### 2.4 Get API Credentials
1. Click Settings icon (gear, left sidebar)
2. Click "API" in settings menu
3. Copy two values:

**Project URL:**
```
https://xxxxx.supabase.co
```

**anon public key:** (long string starting with `eyJh...`)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**SAVE THESE!** You'll need them in next step.

---

## Step 3: Configure Environment Variables (5 minutes)

### 3.1 Open .env.local
```bash
cd "/Users/olamide/Desktop/Vibe coding/sunset-haven-resort"
open .env.local
```

### 3.2 Update Credentials
Replace placeholder values with real ones:

**Before:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
ADMIN_PASSWORD=admin123
```

**After:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ADMIN_PASSWORD=YourSecurePassword123!
```

**Important:**
- Use ACTUAL Project URL from Supabase
- Use ACTUAL anon key from Supabase
- Change admin password to something secure

### 3.3 Save and Restart
1. Save .env.local (Cmd+S)
2. Stop dev server (Ctrl+C in terminal)
3. Start again:
   ```bash
   npm run dev
   ```

---

## Step 4: Test Admin Functions (10 minutes)

### 4.1 Test Dashboard
1. Open: http://localhost:3000/admin
2. **Expected:** Stats should still show zeros (no data yet)

### 4.2 Test Gallery Manager
1. Go to: http://localhost:3000/admin/gallery
2. Click "Add Image" button
3. Fill in:
   - Image URL: `/premium-camping.jpg`
   - Caption: `Premium camping experience`
   - Category: `camping`
4. Click "Add Image"
5. **Expected:** Image card appears in grid

**✅ SUCCESS if:**
- Image displays
- Caption shows below image
- No errors in browser console

**❌ FAIL if:**
- Error alert appears
- Image doesn't show
- Check browser console (F12) for error

### 4.3 Test Testimonials
1. Go to: http://localhost:3000/admin/testimonials
2. Click "Add Testimonial"
3. Fill in:
   - Guest Name: `Test User`
   - Guest Role: `Developer`
   - Quote: `This admin system works great!`
4. Click "Add Testimonial"
5. **Expected:** Testimonial card appears

### 4.4 Test Footer Settings
1. Go to: http://localhost:3000/admin/footer
2. Change email to: `test@sunset-haven.com`
3. Click "Save Changes"
4. **Expected:** "Footer settings saved successfully!" alert
5. Check preview section below - email should be updated

### 4.5 Test Inquiries
Inquiries won't have data yet because contact form isn't connected. We'll test this after deployment.

**Status Check:**
- ✅ All tests pass → Proceed to Step 5
- ❌ Some fail → Check Supabase credentials in .env.local

---

## Step 5: Deploy to Vercel (20 minutes)

### 5.1 Create Vercel Account
1. Go to https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access GitHub

### 5.2 Import Project
1. Click "Add New..." → "Project"
2. Find `Awesohme/Sunset-Haven` in repository list
3. Click "Import"

### 5.3 Configure Project
**Root Directory:** `./` (default)
**Framework Preset:** Next.js (auto-detected)
**Build Command:** `npm run build` (default)
**Output Directory:** `.next` (default)

Leave all as default, scroll down.

### 5.4 Add Environment Variables
Click "Environment Variables" section.

Add these THREE variables:

**Variable 1:**
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://xxxxx.supabase.co  (your actual URL)
```

**Variable 2:**
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1... (your actual key)
```

**Variable 3:**
```
Name: ADMIN_PASSWORD
Value: YourSecurePassword123!  (same as in .env.local)
```

**Important:** Use the SAME values as in your local `.env.local` file.

### 5.5 Deploy
1. Click "Deploy"
2. **Wait 2-3 minutes** for deployment
3. Progress will show:
   - Building...
   - Running Build Command...
   - Uploading Build Output...
   - Deploying...
   - ✅ Ready

### 5.6 Get Your URL
Once deployed, you'll see:
```
🎉 Congratulations! Your project is live!
https://sunset-haven-xxxx.vercel.app
```

Click the URL to visit your live website!

---

## Step 6: Test Production Site (10 minutes)

### 6.1 Test Homepage
1. Visit: `https://your-site.vercel.app`
2. **Check:**
   - ✅ Dark theme loads
   - ✅ Images appear
   - ✅ Neon borders animate
   - ✅ Carousel works
   - ✅ Scroll is smooth

### 6.2 Test Admin
1. Visit: `https://your-site.vercel.app/admin`
2. **Expected:** Same stats as local (1 gallery image, 1 testimonial)
3. Try adding another testimonial
4. **Expected:** Should work same as local

### 6.3 Test Contact Form
1. Go to homepage
2. Scroll to "Connect With Us" section
3. Fill in form:
   - Name: Test User
   - Phone: 1234567890
   - Inquiry: General Inquiry
   - Message: Testing contact form
4. Click "Send Message"
5. **Expected:** "Thank you! We will get back to you soon." message

### 6.4 Verify Inquiry in Admin
1. Go to: `https://your-site.vercel.app/admin/inquiries`
2. **Expected:** You should see your test inquiry
3. Click on it to view details
4. Update status to "Read"
5. **Expected:** Badge color changes to blue

**Status Check:**
- ✅ Everything works → YOU'RE LIVE! 🎉
- ❌ Issues → Check "Troubleshooting" section below

---

## Step 7: Update Contact Form (20 minutes)

The contact form currently just shows an alert. Let's connect it to save to Supabase.

### 7.1 Open Homepage File
```bash
cd "/Users/olamide/Desktop/Vibe coding/sunset-haven-resort"
code app/page.tsx
```

### 7.2 Find Submit Handler
Search for: `async function handleSubmit`

**Current code (around line 583):**
```typescript
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault()
  setIsSubmitting(true)

  // Simulate form submission
  setTimeout(() => {
    console.log('Form submitted:', formData)
    alert('Thank you! We will get back to you soon.')
    setFormData({ name: '', phone: '', inquiryType: '', message: '' })
    setIsSubmitting(false)
  }, 1000)
}
```

### 7.3 Replace with Supabase Integration
Replace the ENTIRE function with:

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

### 7.4 Add Supabase Import
At the top of the file (around line 4), add:

```typescript
import { supabase } from "@/lib/supabase"
```

### 7.5 Test Locally
1. Save file (Cmd+S)
2. Dev server should auto-reload
3. Go to: http://localhost:3000
4. Submit contact form
5. Go to: http://localhost:3000/admin/inquiries
6. **Expected:** New inquiry appears!

### 7.6 Deploy Update
```bash
git add .
git commit -m "Connect contact form to Supabase"
git push origin main
```

Vercel will auto-deploy (takes 2 minutes). Check your live site - form now saves to database!

---

## Step 8: Optional - Custom Domain (15 minutes)

### 8.1 Buy Domain
- Namecheap.com
- GoDaddy.com
- Google Domains
- Name.com

**Suggested domains:**
- sunsethaven.ng
- sunsethaven.com.ng
- sunsethavenresort.com

### 8.2 Add to Vercel
1. Go to Vercel dashboard
2. Click your project
3. Go to "Settings" → "Domains"
4. Enter your domain: `sunsethaven.com`
5. Click "Add"

### 8.3 Configure DNS
Vercel will show DNS records. Add these to your domain registrar:

**Type A Record:**
```
Name: @
Value: 76.76.21.21
```

**Type CNAME Record:**
```
Name: www
Value: cname.vercel-dns.com
```

### 8.4 Wait for Propagation
- DNS can take 5 minutes to 48 hours
- Usually works in 15-30 minutes
- Check: https://dnschecker.org

### 8.5 Enable HTTPS
Vercel auto-enables HTTPS (free SSL certificate). No action needed!

---

## Troubleshooting

### Issue: "Failed to fetch" in admin

**Cause:** Supabase credentials incorrect

**Fix:**
1. Go to Supabase dashboard
2. Settings → API
3. Re-copy Project URL and anon key
4. Update .env.local with correct values
5. Restart dev server

---

### Issue: Images not loading

**Cause:** Image URLs incorrect

**Fix:**
1. Check image exists in `/public` folder
2. URL should start with `/` (e.g., `/premium-camping.jpg`)
3. For external images, use full `https://` URL

---

### Issue: Vercel deployment failed

**Cause:** Build errors

**Fix:**
1. Check Vercel build logs for error
2. Run `npm run build` locally to test
3. Fix TypeScript errors
4. Push fix and redeploy

---

### Issue: Admin shows "No data"

**Cause:** Database empty or credentials wrong

**Fix:**
1. Check Supabase dashboard → Table Editor
2. Verify tables have data
3. Check environment variables in Vercel
4. Re-deploy with correct env vars

---

### Issue: Contact form not saving

**Cause:** Form not connected to Supabase

**Fix:**
Follow "Step 7: Update Contact Form" above

---

## Next Steps After Deployment

### Immediate (Do Today)
- [ ] Add authentication to admin (CRITICAL SECURITY ISSUE!)
- [ ] Test on mobile device
- [ ] Test all admin CRUD operations
- [ ] Add real gallery images (replace test image)
- [ ] Add real testimonials
- [ ] Update footer settings with real info

### This Week
- [ ] Set up Google Analytics
- [ ] Set up PostHog analytics
- [ ] Add email notifications for inquiries
- [ ] Make gallery/testimonials dynamic on frontend
- [ ] Test across browsers (Chrome, Safari, Firefox)
- [ ] Optimize images (convert to WebP)
- [ ] Add SEO meta tags

### This Month
- [ ] Implement proper admin authentication
- [ ] Add booking system integration
- [ ] Set up payment gateway (Paystack)
- [ ] Create email templates
- [ ] Add more images to gallery
- [ ] Collect more testimonials
- [ ] Set up WhatsApp Business integration

---

## Important URLs

### Development
- **Local Site:** http://localhost:3000
- **Local Admin:** http://localhost:3000/admin

### Production (Update with your URLs)
- **Live Site:** https://sunset-haven-xxxx.vercel.app
- **Live Admin:** https://sunset-haven-xxxx.vercel.app/admin

### Services
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Vercel Dashboard:** https://vercel.com/dashboard
- **GitHub Repo:** https://github.com/Awesohme/Sunset-Haven

---

## Quick Reference Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Test production build locally
npm run start

# Check for errors
npm run lint

# Commit and push changes
git add .
git commit -m "Your message"
git push origin main

# View git status
git status

# Pull latest changes
git pull origin main
```

---

## Support Contacts

### Business
- **Email:** tarkwabaylifestyle@gmail.com
- **Phone:** +234 806 935 9028
- **Instagram:** @sunset.haven__

### Technical Issues
1. Check PROJECT_STATUS/README.md
2. Check ADMIN_SETUP.md
3. Check GitHub issues
4. Check Supabase docs: https://supabase.com/docs
5. Check Next.js docs: https://nextjs.org/docs

---

## Success Checklist

Before considering project "done", verify:

### Frontend
- [ ] Homepage loads without errors
- [ ] All images display correctly
- [ ] Neon borders animate smoothly
- [ ] Contact form submits successfully
- [ ] Mobile responsive design works
- [ ] All links work

### Admin
- [ ] Dashboard shows correct stats
- [ ] Can add/edit/delete gallery images
- [ ] Can add/edit/delete testimonials
- [ ] Can update footer settings
- [ ] Can view and manage inquiries
- [ ] All CRUD operations work

### Deployment
- [ ] Site is live on Vercel
- [ ] Custom domain configured (optional)
- [ ] HTTPS enabled
- [ ] Environment variables set
- [ ] No console errors
- [ ] Performance acceptable (< 3s load time)

### Security
- [ ] .env.local not in git
- [ ] Supabase credentials secure
- [ ] Admin authentication implemented (CRITICAL!)
- [ ] RLS policies tightened

---

## Estimated Timeline

```
Step 1: Verify Local Setup     →  5 minutes
Step 2: Set Up Supabase         → 15 minutes
Step 3: Configure Environment   →  5 minutes
Step 4: Test Admin Functions    → 10 minutes
Step 5: Deploy to Vercel        → 20 minutes
Step 6: Test Production Site    → 10 minutes
Step 7: Update Contact Form     → 20 minutes
Step 8: Custom Domain           → 15 minutes (optional)
                                 ────────────
Total:                           ~100 minutes (1.5-2 hours)

+ Troubleshooting buffer:        ~30 minutes
                                 ────────────
Grand Total:                     ~2-3 hours
```

---

## You're Done! 🎉

Congratulations! Your Sunset Haven Resort website is now live. Here's what you've accomplished:

✅ Dark, modern website with sunset theme
✅ 7 content sections (Hero, About, Stats, Experiences, Gallery, Testimonials, Contact)
✅ Full admin backoffice with CRUD operations
✅ Database-backed content management
✅ Deployed to production on Vercel
✅ Ready to receive inquiries

**What's Next?**
- Share your website: `https://your-site.vercel.app`
- Add authentication to admin (CRITICAL!)
- Start adding real content
- Set up analytics
- Promote on social media

**Need Help?**
Check the other documentation files in PROJECT_STATUS folder for detailed information.

---

**Last Updated:** 2025-10-24
**Guide Version:** 1.0.0
**Difficulty:** Beginner-Friendly
**Time:** 2-3 hours
