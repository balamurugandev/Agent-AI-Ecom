# Quick Start Guide - Supabase Setup

## 🚀 Quick Setup (5 minutes)

### 1. Create `.env` file

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://lmuqidjftjonxqraclhd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtdXFpZGpmdGpvbnhxcmFjbGhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1Mzk0NDUsImV4cCI6MjA3ODExNTQ0NX0.fnJTaYSRUgKyojCwhlPGYAi4q7RvMaCoTEuRQcIdfE0
```

### 2. Set up database schema

1. Go to: https://supabase.com/dashboard/project/lmuqidjftjonxqraclhd
2. Click **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy entire contents of `supabase/schema.sql`
5. Paste and click **Run** (or Cmd/Ctrl + Enter)

### 3. Seed the database

```bash
npx tsx scripts/seed-database.ts
```

### 4. Restart dev server

```bash
# Stop current server (Ctrl+C) then:
npm run dev
```

✅ Done! Your app is now using Supabase!

---

For detailed instructions, see [SETUP_SUPABASE.md](./SETUP_SUPABASE.md)

