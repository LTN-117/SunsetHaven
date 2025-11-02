# Instagram Feed Widget Setup Guide

Your homepage now has an Instagram feed section ready to go! Follow these steps to connect your live Instagram feed.

---

## Quick Setup (10 minutes) - RECOMMENDED

### Option 1: Elfsight Instagram Feed (Easiest)

**Best for:** Quick setup, beautiful design, no coding

1. **Go to Elfsight:**
   - Visit: https://elfsight.com/instagram-feed-instashow/
   - Click "Create Widget for Free"

2. **Connect Instagram:**
   - Sign up/login to Elfsight
   - Connect your @sunset.haven__ Instagram account
   - Customize the feed (grid layout, 6-12 posts recommended)

3. **Get Embed Code:**
   - Click "Add to website"
   - Copy the embed code (looks like `<script src="https://apps.elfsight.com/p/platform.js"...`)

4. **Add to Your Site:**
   - Open: `app/page.tsx`
   - Find line 576: `{/* Placeholder - Replace with actual widget code */}`
   - Replace the entire `<div className="text-center py-16">...</div>` block with your Elfsight embed code
   - Save the file

5. **Done!**
   - Refresh your homepage
   - Your Instagram feed should appear

**Free Tier:**
- Shows 12 posts
- "Powered by Elfsight" branding
- 5,000 views/month

**Paid ($5.99/month):**
- Remove branding
- Unlimited views
- Custom styling

---

### Option 2: SnapWidget (Alternative)

**Website:** https://snapwidget.com/

1. Visit SnapWidget and create free account
2. Create new "Instagram Grid" widget
3. Enter your Instagram username: `sunset.haven__`
4. Customize: 3 columns × 2-4 rows
5. Copy embed code
6. Paste into `app/page.tsx` at line 576 (same location as above)

**Free Tier:**
- Small "SnapWidget" watermark
- Up to 30 posts

**Paid ($6/month):**
- No watermark
- More customization

---

### Option 3: LightWidget (Simple)

**Website:** https://lightwidget.com/

1. Go to LightWidget
2. Enter Instagram username
3. Choose "Grid" layout
4. Generate widget
5. Copy embed code
6. Add to your site

**100% Free** - but shows small "LightWidget" link

---

## Advanced Setup (2-3 hours) - Custom API

If you want full control with no branding or monthly fees:

### Instagram Basic Display API

**Prerequisites:**
- Facebook Developer account
- Instagram account must be a Business/Creator account

**Steps:**

1. **Create Facebook App:**
   - Go to: https://developers.facebook.com/
   - Create new app → "Business" type
   - Add "Instagram Basic Display" product

2. **Configure App:**
   - Add Instagram account
   - Get Client ID and Client Secret
   - Set redirect URI to your website

3. **Get Access Token:**
   - Follow Instagram API authentication flow
   - Get long-lived access token (60-day expiration)
   - Set up automatic token refresh

4. **Build Custom Component:**
   ```typescript
   // Create: app/components/InstagramFeed.tsx
   // Fetch posts from Instagram API
   // Display in custom grid
   ```

5. **Replace Placeholder:**
   - Import your custom component
   - Replace placeholder section

**Full tutorial:** https://developers.facebook.com/docs/instagram-basic-display-api/getting-started

---

## Where to Add the Widget Code

**File:** `app/page.tsx`

**Location:** Around line 576

**Find this:**
```tsx
{/* Placeholder - Replace with actual widget code */}
<div className="text-center py-16">
  <div className="mb-6">
    <svg className="w-20 h-20 mx-auto text-gray-600"...
```

**Replace entire block** (from `<div className="text-center py-16">` to closing `</div>`) with your widget embed code.

**Example Result:**
```tsx
{/* Instagram Widget */}
<script src="https://apps.elfsight.com/p/platform.js" defer></script>
<div class="elfsight-app-YOUR-WIDGET-ID"></div>
```

---

## Current Setup

✅ **Already Done:**
- Instagram section added to homepage
- Positioned between gallery and testimonials
- Styled to match your sunset theme
- Clickable Instagram link to @sunset.haven__
- Responsive design

⏳ **Next Steps:**
1. Choose a widget service (Elfsight recommended)
2. Create widget and get embed code
3. Replace placeholder in `app/page.tsx`
4. Test on homepage

---

## Styling Tips

The Instagram feed container already has:
- Dark glassmorphism background
- Rounded corners
- Sunset theme colors
- Responsive padding

Most widgets will automatically adapt to the container width. If you need custom styling:

```css
/* Add to globals.css if needed */
.instagram-feed-container {
  max-width: 1200px;
  margin: 0 auto;
}
```

---

## Support

**Elfsight Support:** support@elfsight.com
**SnapWidget Support:** https://snapwidget.com/support
**Instagram API Docs:** https://developers.facebook.com/docs/instagram-basic-display-api

---

## Quick Links

- Your Instagram: https://instagram.com/sunset.haven__
- Elfsight: https://elfsight.com/instagram-feed-instashow/
- SnapWidget: https://snapwidget.com/
- LightWidget: https://lightwidget.com/

---

**Questions?** Check the main README.md or contact your developer.
