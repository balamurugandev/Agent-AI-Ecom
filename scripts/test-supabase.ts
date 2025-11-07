/**
 * Test Supabase Connection
 * 
 * This script tests if your Supabase connection is working.
 * Run: npx tsx scripts/test-supabase.ts
 */

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables!')
  console.error('Make sure .env file exists with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
  process.exit(1)
}

console.log('🔗 Testing Supabase connection...\n')
console.log(`URL: ${supabaseUrl.substring(0, 30)}...`)

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    // Test connection by querying a table
    const { data, error } = await supabase
      .from('categories')
      .select('count')
      .limit(1)

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('⚠️  Connection works, but tables don\'t exist yet.')
        console.log('   → You need to run the schema.sql in Supabase SQL Editor')
        console.log('   → See supabase/setup-instructions.md for details\n')
        return false
      }
      throw error
    }

    console.log('✅ Connection successful!')
    console.log('✅ Supabase is properly configured\n')
    return true
  } catch (error: any) {
    console.error('❌ Connection failed:', error.message)
    if (error.message.includes('categories')) {
      console.log('\n💡 Tip: Run the schema.sql in Supabase SQL Editor first')
      console.log('   See supabase/setup-instructions.md\n')
    }
    return false
  }
}

testConnection().then(success => {
  if (success) {
    console.log('🎉 Ready to seed database!')
    console.log('   Run: npx tsx scripts/seed-database.ts\n')
  }
  process.exit(success ? 0 : 1)
})

