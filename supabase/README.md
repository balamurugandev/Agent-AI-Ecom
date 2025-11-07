# Supabase Database Setup

This directory contains SQL scripts to set up your Supabase database for the e-commerce app.

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Wait for the project to be provisioned

### 2. Get Your Supabase Credentials

1. Go to your project settings: **Settings** → **API**
2. Copy your **Project URL** and **anon/public key**
3. Create a `.env` file in the root of your project:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Run the Database Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `schema.sql`
4. Click **Run** to execute the schema

This will create:
- `categories` table
- `products` table
- `product_variants` table
- Indexes for performance
- Row Level Security (RLS) policies for public read access

### 4. Seed Your Database

You have several options to populate your database:

#### Option A: Use the Supabase Dashboard
1. Go to **Table Editor** in your Supabase dashboard
2. Manually add categories and products
3. Or import CSV/JSON files

#### Option B: Use SQL Scripts
1. Convert your `src/data/products.json` to SQL INSERT statements
2. Run them in the SQL Editor

#### Option C: Use a Migration Script
Create a script to read `src/data/products.json` and insert into Supabase:

```typescript
// scripts/seed-database.ts
import { createClient } from '@supabase/supabase-js'
import productsData from '../src/data/products.json'
import categoriesData from '../src/data/categories.json'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
)

async function seedDatabase() {
  // Insert categories
  for (const category of categoriesData) {
    const { error } = await supabase
      .from('categories')
      .upsert({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
      })
    
    if (error) console.error('Error inserting category:', error)
  }

  // Insert products
  for (const product of productsData) {
    const { data, error } = await supabase
      .from('products')
      .upsert({
        id: product.id,
        title: product.title,
        slug: product.slug,
        images: product.images,
        price: product.price,
        compare_at_price: product.compareAtPrice,
        rating: product.rating,
        rating_count: product.ratingCount,
        badges: product.badges,
        category: product.category,
        description: product.description,
        specs: product.specs,
      })
      .select()
      .single()

    if (error) {
      console.error('Error inserting product:', error)
      continue
    }

    // Insert variants
    if (product.variants && product.variants.length > 0) {
      const variants = product.variants.map(v => ({
        id: v.id,
        product_id: product.id,
        color: v.color,
        size: v.size,
        stock: v.stock,
      }))

      const { error: variantError } = await supabase
        .from('product_variants')
        .upsert(variants)

      if (variantError) console.error('Error inserting variants:', variantError)
    }
  }
}

seedDatabase()
```

### 5. Verify Your Setup

1. Check that tables are created in **Table Editor**
2. Verify RLS policies in **Authentication** → **Policies**
3. Test queries in **SQL Editor**

## Database Schema

### Categories
- `id` (UUID, Primary Key)
- `name` (TEXT, Unique)
- `slug` (TEXT, Unique)
- `description` (TEXT, Nullable)
- `created_at` (Timestamp)

### Products
- `id` (UUID, Primary Key)
- `title` (TEXT)
- `slug` (TEXT, Unique)
- `images` (TEXT[])
- `price` (DECIMAL)
- `compare_at_price` (DECIMAL, Nullable)
- `rating` (DECIMAL, 0-5)
- `rating_count` (INTEGER)
- `badges` (TEXT[])
- `category` (TEXT, Foreign Key → categories.name)
- `description` (TEXT)
- `specs` (JSONB)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Product Variants
- `id` (UUID, Primary Key)
- `product_id` (UUID, Foreign Key → products.id)
- `color` (TEXT, Nullable)
- `size` (TEXT, Nullable)
- `stock` (INTEGER)
- `created_at` (Timestamp)

## Row Level Security (RLS)

All tables have RLS enabled with public read access. This means:
- Anyone can read categories, products, and variants
- Only authenticated users can write (if you add auth later)

To modify RLS policies, go to **Authentication** → **Policies** in your Supabase dashboard.

## Troubleshooting

### Connection Issues
- Verify your `.env` file has the correct values
- Check that your Supabase project is active
- Ensure you're using the `anon` key, not the `service_role` key

### Query Errors
- Check that tables exist in **Table Editor**
- Verify RLS policies allow the operations you're trying to perform
- Check the browser console for detailed error messages

### Data Not Showing
- Verify data exists in **Table Editor**
- Check that RLS policies allow read access
- Ensure category names match between products and categories tables

