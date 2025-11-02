# Git Commands - Call of Duty Warzone Edition 🎮

**Think of Git like Warzone:**
- Your project = The Map (Verdansk)
- GitHub = The Cloud/Lobby where your squad syncs
- Commits = Checkpoints/Loadout Saves
- Branches = Different Drop Zones
- Push = Extracting with your loot
- Pull = Getting your squad's loot

---

## Basic Workflow (90% of what you'll use)

### 1. THE STANDARD DROP (Everyday Push)

**Situation:** You made changes and want to save to GitHub

```bash
# 1. Navigate to your project (Drop into the map)
cd "/Users/olamide/Desktop/Vibe coding/sunset-haven-resort"

# 2. Check what you changed (Check your inventory)
git status

# 3. Add all changes (Pick up all the loot)
git add .

# 4. Create a save point (Mark your loadout)
git commit -m "Your message here"

# 5. Push to GitHub (Extract with the loot)
git push origin main
```

**Real Example:**
```bash
cd "/Users/olamide/Desktop/Vibe coding/sunset-haven-resort"
git add .
git commit -m "Fixed contact form bug"
git push origin main
```

**Expected Output:**
```
To https://github.com/Awesohme/Sunset-Haven.git
   123abc4..456def7  main -> main
```

✅ **Success!** Your changes are on GitHub.

---

## Common Situations (With Warzone Analogies)

### Situation 1: "Repository Not Found" Error

**Warzone:** You're trying to extract but the helicopter isn't there!

**Error:**
```
remote: Repository not found.
fatal: repository 'https://github.com/...' not found
```

**Cause:** Git doesn't have access credentials (like trying to board the heli without your squad ID)

**Fix - Use PAT (Your VIP Pass):**
```bash
# Add your PAT to the remote URL
git remote set-url origin https://YOUR_PAT_HERE@github.com/username/repository.git

# Now push
git push origin main
```

**After push succeeds, clean up the URL (remove PAT from visibility):**
```bash
git remote set-url origin https://github.com/username/repository.git
```

---

### Situation 2: "Rejected - Non-Fast-Forward" Error

**Warzone:** Someone on your squad already extracted and you have old loot!

**Error:**
```
! [rejected]        main -> main (non-fast-forward)
error: failed to push some refs
hint: Updates were rejected because the tip of your current branch is behind
```

**Cause:** GitHub has changes you don't have locally (like your teammate got better loot)

**Fix - Get Squad's Loot First:**
```bash
# 1. Get the latest from GitHub (Download your squad's loadout)
git pull origin main

# 2. If no conflicts, push yours
git push origin main
```

**If you get MERGE CONFLICT (Your squad has different gear):**
```bash
# Git will tell you which files conflict
# Open those files, you'll see:
<<<<<<< HEAD
Your changes
=======
Their changes
>>>>>>> commit-hash

# Pick which to keep (or combine), then:
git add .
git commit -m "Resolved merge conflict"
git push origin main
```

---

### Situation 3: "Nothing to Commit" Message

**Warzone:** You didn't pick up any loot yet!

**Message:**
```
nothing to commit, working tree clean
```

**Cause:** You haven't made any changes since last push.

**Solution:** Make some changes first, then commit!

---

### Situation 4: Forgot to Add Files

**Warzone:** You left loot on the ground!

**Problem:** You committed but forgot to add some files

**Fix - Quick Amend (Add to last loadout):**
```bash
# Make your changes, then:
git add .
git commit --amend --no-edit
git push origin main --force
```

⚠️ **WARNING:** Only use `--force` if you haven't shared the commit yet! (Don't force if squad already has it)

---

### Situation 5: Want to Undo Last Commit

**Warzone:** You picked up the wrong gun and want to drop it!

**Soft Reset (Keep changes, undo commit):**
```bash
git reset --soft HEAD~1
# Your changes are still there, just not committed
# Now you can commit again differently
```

**Hard Reset (DELETE EVERYTHING - DANGER!):**
```bash
git reset --hard HEAD~1
# ⚠️ CAUTION: This deletes all changes! Like dying in Warzone!
```

---

### Situation 6: Check What Changed

**Warzone:** Check your killcam/replay

**See what you changed:**
```bash
# See all changes
git diff

# See changes in specific file
git diff app/page.tsx

# See what you last committed
git log -1

# See last 5 commits
git log -5 --oneline
```

---

### Situation 7: Discard Changes to One File

**Warzone:** You picked up the wrong gun, drop it!

```bash
# Restore one file to last committed version
git checkout -- app/page.tsx

# Or with newer syntax
git restore app/page.tsx
```

---

### Situation 8: Push Failed - Need to Force

**Warzone:** The extraction heli is glitched, need to call a new one!

**Only use when you're SURE (like using a self-revive):**
```bash
git push origin main --force

# Safer version (won't overwrite if someone else pushed)
git push origin main --force-with-lease
```

⚠️ **DANGER ZONE:** Only force push if:
- You're the only one working on the project
- You're absolutely sure what you're doing
- You haven't shared the commits with your team

---

## Quick Command Reference (Your Loadout)

### Daily Use (Primary Weapons)
```bash
git status              # Check what changed (Check inventory)
git add .               # Add all changes (Pick up all loot)
git commit -m "msg"     # Save with message (Save loadout)
git push origin main    # Push to GitHub (Extract)
git pull origin main    # Get latest (Get squad's loot)
```

### Occasional Use (Secondary Weapons)
```bash
git log                 # See history (View match history)
git diff                # See changes (Check killcam)
git branch              # See branches (See drop zones)
git checkout -b new     # Create new branch (New drop zone)
```

### Emergency Use (Killstreaks)
```bash
git reset --soft HEAD~1 # Undo last commit, keep changes
git reset --hard HEAD~1 # Undo last commit, DELETE changes ⚠️
git push --force        # Force push (Dangerous! ⚠️)
git stash               # Hide changes temporarily
git stash pop           # Bring back hidden changes
```

---

## Pro Tips (Advanced Tactics)

### 1. Add PAT to .env (Keep Your VIP Pass Secure)

Store your PAT securely in `.env.local`:
```
GITHUB_PAT=your_personal_access_token_here
```

This file is in `.gitignore` so it won't be pushed to GitHub.

### 2. Quick Push Alias (Speedrun Strategy)

Add to your terminal config (`~/.zshrc` or `~/.bashrc`):
```bash
alias gp='git add . && git commit -m "Quick update" && git push origin main'
```

Then just type:
```bash
gp
```

And it does everything!

### 3. Better Commit Messages (Communication)

**Bad (like saying "gg" after every kill):**
```bash
git commit -m "update"
git commit -m "fix"
git commit -m "changes"
```

**Good (like clear callouts):**
```bash
git commit -m "Fix contact form validation bug"
git commit -m "Add new gallery images for camping section"
git commit -m "Update footer with new Instagram handle"
```

### 4. Check Before You Push (Check Your Six)

```bash
# Always check what you're about to push
git status
git diff

# Then push
git add .
git commit -m "Your message"
git push origin main
```

### 5. See What You're Pushing (Preview Extraction)

```bash
# See commits that will be pushed
git log origin/main..HEAD

# See file changes that will be pushed
git diff origin/main..HEAD
```

---

## Common Scenarios - Step by Step

### Scenario A: Made Small Change, Quick Push

```bash
# 1. Go to project
cd "/Users/olamide/Desktop/Vibe coding/sunset-haven-resort"

# 2. Check status
git status

# 3. Add, commit, push (one-liner)
git add . && git commit -m "Fixed typo in hero section" && git push origin main
```

---

### Scenario B: Multiple Changes, Organized Push

```bash
# 1. Go to project
cd "/Users/olamide/Desktop/Vibe coding/sunset-haven-resort"

# 2. Check what changed
git status

# 3. Review changes
git diff

# 4. Add specific files (if you want to commit separately)
git add app/page.tsx
git commit -m "Update hero section"

git add components/admin/AdminLayout.tsx
git commit -m "Fix admin sidebar on mobile"

# 5. Push all commits
git push origin main
```

---

### Scenario C: Oh Crap, I Broke Something!

```bash
# Option 1: Discard all changes (reset to last working version)
git reset --hard HEAD

# Option 2: Discard one file
git checkout -- app/page.tsx

# Option 3: Undo last commit but keep changes
git reset --soft HEAD~1
# Fix the issue, then commit again

# Option 4: Go back to a specific commit
git log --oneline  # Find the commit hash
git reset --hard abc1234  # Replace with actual hash
```

---

### Scenario D: Need to Work on New Feature (Branches)

```bash
# 1. Create new branch (new drop zone)
git checkout -b feature/new-booking-system

# 2. Make changes, commit
git add .
git commit -m "Add booking form"

# 3. Push to new branch
git push origin feature/new-booking-system

# 4. When done, merge to main
git checkout main
git merge feature/new-booking-system
git push origin main
```

---

## Troubleshooting (Gulag Situations)

### Problem: "Permission Denied"

**Fix:**
```bash
# Use PAT in URL
git remote set-url origin https://ghp_YOUR_PAT@github.com/Awesohme/Sunset-Haven.git
git push origin main
```

### Problem: "Merge Conflict"

**Fix:**
```bash
# 1. Pull first
git pull origin main

# 2. Open conflicted files, look for:
<<<<<<< HEAD
Your code
=======
Their code
>>>>>>> commit-hash

# 3. Edit file, keep what you want, remove markers

# 4. Commit the fix
git add .
git commit -m "Resolved merge conflict"
git push origin main
```

### Problem: "Detached HEAD"

**Warzone:** You're spectating instead of playing!

**Fix:**
```bash
git checkout main
```

### Problem: Pushed Wrong Thing

**Fix (within 1 minute):**
```bash
# Undo last commit locally
git reset --hard HEAD~1

# Force push (overwrites GitHub)
git push origin main --force
```

⚠️ Only if no one else has pulled your bad commit!

---

## The Ultimate Cheat Sheet

**Open new terminal, copy-paste this:**

```bash
# Navigate to project
cd "/Users/olamide/Desktop/Vibe coding/sunset-haven-resort"

# Standard push workflow
git status                # Check changes
git add .                 # Add all
git commit -m "Update"    # Commit
git push origin main      # Push

# If push fails (need PAT):
git remote set-url origin https://YOUR_PAT_HERE@github.com/username/repository.git
git push origin main
git remote set-url origin https://github.com/username/repository.git

# If rejected (need to pull first):
git pull origin main      # Get latest
git push origin main      # Try again

# View history
git log --oneline -5      # Last 5 commits

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (DELETE changes)
git reset --hard HEAD~1
```

---

## Emergency Contact (When You're Down)

1. **Can't push?** → Use PAT in remote URL
2. **Merge conflict?** → Pull first, resolve conflicts manually
3. **Broke something?** → `git reset --hard HEAD` (nuclear option)
4. **Need help?** → `git status` tells you what to do
5. **Really stuck?** → Google the error message + "git"

---

## Save This! (Your Field Guide)

**Bookmark these commands:**

```bash
# The Big 5 (99% of your needs)
cd "/Users/olamide/Desktop/Vibe coding/sunset-haven-resort"
git add .
git commit -m "Your message"
git push origin main
git pull origin main

# Emergency (1% clutch situations)
git reset --hard HEAD     # Reset everything
git push --force          # Force push (DANGER!)
```

---

## Practice Round (Try Now!)

**Open new terminal:**

```bash
# 1. Navigate
cd "/Users/olamide/Desktop/Vibe coding/sunset-haven-resort"

# 2. Make a test change
echo "# Test" >> test.txt

# 3. Check status
git status

# 4. Add, commit, push
git add .
git commit -m "Test commit"
git push origin main

# 5. Remove test file
rm test.txt
git add .
git commit -m "Remove test file"
git push origin main
```

✅ If this works, you're ready for the real thing!

---

## Remember (Your Rulebook)

1. **Always `git status` first** (check inventory)
2. **Commit often** (frequent checkpoints)
3. **Write clear commit messages** (good callouts)
4. **Pull before you push** (sync with squad)
5. **Don't force push unless alone** (no friendly fire)
6. **Keep PAT secret** (secure your VIP pass)
7. **Test locally before push** (check loadout works)

---

## Victory Royale! 🏆

You now know how to push to GitHub without using Claude tokens!

**The Golden Path:**
```bash
cd "/Users/olamide/Desktop/Vibe coding/sunset-haven-resort"
git add . && git commit -m "Your message" && git push origin main
```

**That's it!** 90% of the time, that's all you need.

---

**Last Updated:** 2025-10-24
**Difficulty:** Noob-Friendly 🎮
**Time to Learn:** 15 minutes
**Win Rate:** 99% with this guide
