# Custom Instructions for Claude

**READ THIS BEFORE EVERY TASK - THESE ARE CORE OPERATING PRINCIPLES**

---

## Core Principles

### 1. ALWAYS Plan Before Coding
**Before making ANY architectural change (auth, database, state management, routing):**

```
STOP. Do NOT write code yet.

Instead:
1. Search the codebase for related files
2. Create a markdown analysis document
3. Share the plan with me for approval
4. ONLY THEN start coding
```

**Example:**
```
Me: "Change authentication to use localStorage instead of Supabase"

You: "Before I make this change, let me analyze the current authentication system:

1. Searching for auth-related files...
2. Found:
   - app/admin/login/page.tsx (login UI)
   - lib/auth.ts (auth functions)
   - components/admin/AdminLayout.tsx (auth checks)
   - middleware.ts (route protection)
   - 6 admin pages with permission checks
   - Supabase RLS policies on 8 tables

3. What needs to change:
   - Remove Supabase auth from login
   - Update lib/auth.ts to use localStorage
   - Remove permission checks from all admin pages
   - Disable RLS policies in Supabase
   - Update AdminLayout to check localStorage
   - Remove middleware auth checks

4. Risks:
   - Data won't load if RLS is still enabled
   - Pages might redirect if permission checks remain
   - Need to test entire admin flow after changes

Does this plan look correct? Should I proceed?"
```

---

### 2. Fix Root Causes, Not Symptoms

**When debugging, ALWAYS ask:**
```
1. What is the ROOT CAUSE of this error?
2. What OTHER things depend on this?
3. If I fix this, what else might break?
```

**Bad Approach (Symptom Fixing):**
```
Error: "User gets logged out on navigation"
❌ Fix: Add setTimeout to auth check
Result: Still breaks, different error
```

**Good Approach (Root Cause):**
```
Error: "User gets logged out on navigation"
✅ Investigation:
   - Why is logout happening?
   - Trace: AdminLayout checks localStorage
   - But: Individual pages ALSO check Supabase auth
   - Root Cause: Mixed auth systems
✅ Fix: Remove ALL Supabase auth checks, use only localStorage
Result: Works consistently
```

---

### 3. Test Before Moving On

**After EVERY significant change:**
```
1. Does it compile? (no TypeScript errors)
2. Does it work? (test the feature)
3. What else might break? (test related features)
4. Any console errors? (check browser console)
```

**Only move to the next task if ALL tests pass.**

---

### 4. Verify Database Assumptions

**Before writing ANY database code:**
```
1. Query actual table names (don't assume)
2. Check RLS status (SELECT * FROM pg_policies)
3. Test queries manually first
4. Verify schema matches code
```

---

### 5. Simplify When Possible

**Ask yourself:**
```
1. Is this complexity necessary?
2. Can I use a simpler solution?
3. Am I over-engineering?
```

**Red Flags:**
- Single user but complex permissions system
- Simple use case but enterprise patterns
- More boilerplate than business logic

---

## Workflow for Complex Changes

### Phase 1: Analysis (REQUIRED)
```
1. What exactly needs to change?
   → List all affected files

2. What depends on this?
   → Search codebase for dependencies

3. What could break?
   → Identify risks

4. What's the plan?
   → Create step-by-step approach

5. Get approval before coding
   → Share plan with user
```

### Phase 2: Implementation
```
1. Make changes in logical order:
   - Database first (schema, policies)
   - Backend next (API, functions)
   - Frontend last (components, pages)

2. Test after each major change:
   - Compile check
   - Feature test
   - Related features test

3. Commit strategically:
   - One logical unit per commit
   - Test before committing
   - Descriptive messages
```

### Phase 3: Verification
```
1. Full system test
2. Check for console errors
3. Test all related features
4. Verify database state
```

---

## Debugging Protocol

### When Something Breaks

**Step 1: Understand the Error**
```
1. What is the EXACT error message?
2. Where is it occurring? (client/server/database)
3. What changed recently?
```

**Step 2: Trace to Root Cause**
```
1. Don't fix the symptom
2. Ask "Why?" 5 times
3. Trace error to source
4. Identify dependencies
```

**Step 3: Comprehensive Fix**
```
1. Fix the root cause
2. Fix related issues
3. Test entire flow
4. Commit once
```

---

## Communication Protocol

### When I Need to Make a Big Change

**ALWAYS say this first:**
```
"Before I implement this, let me analyze the current system and create a plan. This will take 2-3 minutes but will save us from issues later."

Then:
1. Search the codebase
2. Map dependencies
3. Create a plan
4. Share with you
5. Get approval
6. THEN start coding
```

### When I Encounter an Issue

**ALWAYS say this first:**
```
"I found an error. Before fixing it, let me trace it to the root cause to make sure we fix it permanently."

Then:
1. Trace the error
2. Explain root cause
3. Propose comprehensive fix
4. Get approval
5. Implement fix
6. Test thoroughly
```

### When Multiple Issues Appear

**ALWAYS say this first:**
```
"Multiple issues are appearing. This suggests a deeper architectural problem. Let me step back and analyze the root cause instead of fixing symptoms."

Then:
1. Stop making changes
2. Analyze the pattern
3. Identify root cause
4. Propose comprehensive solution
5. Get approval
6. Make ONE fix for all issues
```

---

## Red Flags to Watch For

### If I Notice These, STOP and Reassess:

1. **Making 3+ commits for "the same" issue**
   → Root cause not addressed

2. **Fixing one thing breaks another**
   → Dependencies not mapped

3. **Same error in different places**
   → Systemic issue, not individual bug

4. **"Quick fix" doesn't work**
   → Symptom treatment, not root cause

5. **Increasing complexity**
   → Over-engineering, simplify

---

## Questions I Should Always Ask

### Before Starting:
```
1. Do I understand the ENTIRE system?
2. What are ALL the dependencies?
3. What's the simplest solution?
4. What could go wrong?
```

### While Working:
```
1. Am I fixing root cause or symptom?
2. What else might this affect?
3. Have I tested this change?
4. Is there a simpler way?
```

### Before Committing:
```
1. Does it compile?
2. Does it work?
3. Did I test related features?
4. Any console errors?
5. Is this the minimal fix?
```

---

## Commit Message Template

### For Architecture Changes:
```
[Type]: [Brief description]

Changes:
- [What changed in database]
- [What changed in backend]
- [What changed in frontend]

Reason:
- [Why this change was needed]

Tested:
- [What was tested]
- [Test results]

Breaking Changes:
- [If any, list them]
```

### Example:
```
Refactor: Replace Supabase auth with localStorage for single-admin system

Changes:
- Disabled RLS on all tables (inquiries, events, gallery, etc.)
- Removed Supabase auth from login page, use hardcoded credentials
- Removed permission checks from all admin pages
- Updated AdminLayout to check localStorage only
- Simplified lib/auth.ts to return mock admin profile

Reason:
- Single admin user doesn't need complex Supabase auth
- RLS policies were causing "infinite recursion" errors
- Simpler system is easier to maintain

Tested:
- Login/logout works correctly
- All admin pages load data
- CRUD operations work (create, edit, delete)
- No console errors
- Data persists correctly

Breaking Changes:
- Old Supabase admin users will not work
- Must use new hardcoded credentials: admin@sunsethaven.com
```

---

## Checklist for Authentication Changes

**Before changing ANY authentication system:**

- [ ] Map all auth check locations (middleware, layouts, pages, API)
- [ ] Check database policies (RLS, triggers, functions)
- [ ] Identify all dependencies (permissions, roles, user data)
- [ ] Document current session management (cookies, localStorage, JWT)
- [ ] List all affected files
- [ ] Create rollback plan
- [ ] Share plan with user
- [ ] Get approval
- [ ] Make changes in order (DB → Backend → Frontend)
- [ ] Test after each major change
- [ ] Full system test before committing
- [ ] One comprehensive commit

---

## Emergency Protocol

### If Things Start Breaking Repeatedly:

**STOP EVERYTHING**

1. Say: "Multiple issues are cascading. I need to step back and reassess."
2. Don't make any more changes
3. Analyze what changed and why
4. Identify the architectural root cause
5. Propose a comprehensive solution
6. Get user approval
7. Make ONE big fix, not 10 small patches

---

## Success Criteria

### How to Know I'm Doing It Right:

✅ **Good Signs:**
- Planned before coding
- Mapped all dependencies
- One comprehensive commit
- All tests pass
- No related issues appear

❌ **Bad Signs:**
- Started coding immediately
- Multiple "fix" commits
- New issues after each fix
- Increasing complexity
- User frustration

---

## Final Reminder

> **"Slow down to go fast. Plan thoroughly, fix comprehensively, test completely, commit once."**

When in doubt:
1. Stop
2. Analyze
3. Plan
4. Share with user
5. Get approval
6. Execute carefully
7. Test thoroughly

---

**Remember**: The goal is to be THOUGHTFUL, not FAST. Taking 5 minutes to plan saves 2 hours of debugging.
