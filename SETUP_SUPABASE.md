# Supabase Setup Instructions

Follow these steps to complete the Supabase setup:

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Select your project (or create a new one)
3. Navigate to **Settings** → **API**
4. Copy your **Project URL** and **anon/public key**

## Step 2: Create .env File

Create a `.env` file in the root directory with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Important**: Never commit the `.env` file to version control. It's already in `.gitignore`.

## Step 3: Set Up Database Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy the entire contents of `supabase/schema.sql`
5. Paste it into the SQL Editor
6. Click **Run** (or press Cmd/Ctrl + Enter)

This will create:
- ✅ `categories` table
- ✅ `products` table
- ✅ `product_variants` table
- ✅ Indexes for performance
- ✅ Row Level Security (RLS) policies
- ✅ Sample categories

## Step 4: Seed Your Database

You have two options:

### Option A: Use the Seeding Script (Recommended)

1. Install dependencies if you haven't already:
   ```bash
   npm install
   ```
   (This installs tsx and dotenv needed for the seed script)

2. Make sure your `.env` file is created with your Supabase credentials

3. Run the seed script:
   ```bash
   npx tsx scripts/seed-database.ts
   ```
   
   The script will:
   - Load your environment variables from `.env`
   - Import all categories from `src/data/categories.json`
   - Import all products from `src/data/products.json`
   - Import all product variants
   - Show progress for each item inserted

### Option B: Manual Import via Dashboard

1. Go to **Table Editor** in your Supabase dashboard
2. Select the `categories` table
3. Click **Insert** → **Insert row** and add categories manually
4. Repeat for `products` and `product_variants` tables

## Step 5: Verify Setup

1. **Check Tables**: Go to **Table Editor** and verify all three tables exist
2. **Check Data**: Verify that categories and products are populated
3. **Test App**: Restart your dev server and check if products load from Supabase

## Step 6: Restart Development Server

After creating the `.env` file, restart your development server:

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

The app will now use Supabase instead of mock data!

## Troubleshooting

### "Missing Supabase environment variables" Error
- Make sure `.env` file exists in the root directory
- Verify the variable names are exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart your dev server after creating/updating `.env`

### "Table does not exist" Error
- Make sure you ran the `schema.sql` script in SQL Editor
- Check that tables appear in **Table Editor**

### Products Not Loading
- Check browser console for errors
- Verify RLS policies allow public read access
- Check that data exists in **Table Editor**
- The app will fallback to mock data if Supabase fails

### Connection Issues
- Verify your Supabase project is active
- Check that the URL and key are correct
- Ensure you're using the `anon` key, not `service_role` key

## Next Steps

Once everything is set up:
- ✅ Products will load from Supabase
- ✅ Search and filters will query the database
- ✅ All data is stored in PostgreSQL
- ✅ You can manage products via Supabase dashboard

For more details, see [supabase/README.md](./supabase/README.md)

