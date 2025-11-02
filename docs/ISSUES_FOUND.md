# Issues Found During Testing

## 1. Newsletter Page - 400 Bad Request ❌
**Location**: `/admin/newsletter`
**Issue**: Query failing with 400 error
**Likely Cause**: RLS policies blocking `event_newsletter_signups` table
**Fix**: Need to disable RLS or add proper policies for this table

## 2. Testimonials Not Loading from Database ❌
**Location**: `/app/page.tsx` line 349-360
**Issue**: Testimonials are hardcoded (only 2), not loading from database
**Current**: Hardcoded array with 2 testimonials
**Expected**: Load from `testimonials` table (10 items in database)
**Fix**: Replace hardcoded array with `useEffect` + Supabase query

## 3. Add User Dialog - Poor Text Contrast ❌
**Location**: `/app/admin/users/page.tsx`
**Issue**: Text inputs have dark background with dark text - can't see what you're typing
**Fix**: Change input text color to white or light color for visibility

## 4. Image Tagging System Missing ✨ NEW FEATURE REQUEST
**Location**: Gallery upload
**Current**: Only has "Category" field (General, Activity, etc.)
**Requested**:
- Change "Category" to "Tag"
- Add option to link image to specific activities
- Add checkbox for "Show in Hero"
- Add checkbox for "Show in Gallery"

## Summary
- 3 bugs to fix
- 1 new feature to implement
- All other admin pages working correctly

## Priority Order:
1. Fix text contrast (quick win)
2. Fix testimonials loading (critical - users added 10 but only 2 show)
3. Fix newsletter RLS
4. Add image tagging system (enhancement)
