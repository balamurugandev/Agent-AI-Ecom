/**
 * Database Seeding Script
 * 
 * This script reads the JSON data files and imports them into Supabase.
 * 
 * Usage:
 * 1. Make sure your .env file has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
 * 2. Run: npx tsx scripts/seed-database.ts
 * 
 * Note: You may need to install tsx and dotenv: npm install -D tsx dotenv
 */

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import productsData from '../src/data/products.json'
import categoriesData from '../src/data/categories.json'

// Load environment variables from .env file
config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!')
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file')
  console.error('\nExample .env file:')
  console.error('VITE_SUPABASE_URL=https://your-project.supabase.co')
  console.error('VITE_SUPABASE_ANON_KEY=your_anon_key_here')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function seedCategories() {
  console.log('Seeding categories...')
  
  for (const category of categoriesData) {
    const { error } = await supabase
      .from('categories')
      .upsert({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
      }, {
        onConflict: 'id'
      })
    
    if (error) {
      console.error(`Error inserting category ${category.name}:`, error.message)
    } else {
      console.log(`✓ Inserted category: ${category.name}`)
    }
  }
}

async function seedProducts() {
  console.log('\nSeeding products...')
  
  for (const product of productsData) {
    // Insert product
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
      }, {
        onConflict: 'id'
      })
      .select()
      .single()

    if (error) {
      console.error(`Error inserting product ${product.title}:`, error.message)
      continue
    }

    console.log(`✓ Inserted product: ${product.title}`)

    // Insert variants if they exist
    if (product.variants && product.variants.length > 0) {
      const variants = product.variants.map(v => ({
        id: v.id,
        product_id: product.id,
        color: v.color || null,
        size: v.size || null,
        stock: v.stock,
      }))

      const { error: variantError } = await supabase
        .from('product_variants')
        .upsert(variants, {
          onConflict: 'id'
        })

      if (variantError) {
        console.error(`Error inserting variants for ${product.title}:`, variantError.message)
      } else {
        console.log(`  ✓ Inserted ${variants.length} variant(s)`)
      }
    }
  }
}

async function main() {
  try {
    console.log('Starting database seeding...\n')
    
    await seedCategories()
    await seedProducts()
    
    console.log('\n✓ Database seeding completed!')
  } catch (error) {
    console.error('Fatal error:', error)
    process.exit(1)
  }
}

main()

