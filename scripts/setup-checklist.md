# Supabase Setup Checklist

Use this checklist to track your setup progress:

## ✅ Completed

- [x] `.env` file created with Supabase credentials
- [x] Dependencies installed (`@supabase/supabase-js`, `tsx`, `dotenv`)
- [x] Supabase client configured in app
- [x] API layer updated to use Supabase
- [x] Fallback to mock data implemented

## ⏳ To Do

- [ ] **Run database schema in Supabase SQL Editor**
  - [ ] Open: https://supabase.com/dashboard/project/lmuqidjftjonxqraclhd
  - [ ] Go to SQL Editor → New Query
  - [ ] Copy contents of `supabase/schema.sql`
  - [ ] Paste and Run
  - [ ] Verify tables exist in Table Editor

- [ ] **Seed the database**
  - [ ] Run: `npm run seed:db`
  - [ ] Verify products appear in Table Editor

- [ ] **Restart dev server**
  - [ ] Stop current server (Ctrl+C)
  - [ ] Run: `npm run dev`
  - [ ] Verify products load from Supabase

- [ ] **Test the connection**
  - [ ] Run: `npm run test:supabase`
  - [ ] Should show "Connection successful!"

## 🎯 Quick Commands

```bash
# Test Supabase connection
npm run test:supabase

# Seed database (after schema is run)
npm run seed:db

# Start dev server
npm run dev
```

## 📝 Notes

- The app will work with mock data until Supabase is fully set up
- All API functions automatically fallback to JSON files if Supabase fails
- Once schema is run, you can seed the database
- After seeding, restart the dev server to see Supabase data

