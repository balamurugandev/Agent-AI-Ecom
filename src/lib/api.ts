import type { Product, Category } from '@/types'
import { supabase } from './supabase'

// Helper to transform database product to app Product type
function transformProduct(dbProduct: any, variants: any[] = []): Product {
  return {
    id: dbProduct.id,
    title: dbProduct.title,
    slug: dbProduct.slug,
    images: dbProduct.images || [],
    price: dbProduct.price,
    compareAtPrice: dbProduct.compare_at_price || undefined,
    rating: dbProduct.rating || 0,
    ratingCount: dbProduct.rating_count || 0,
    badges: dbProduct.badges as ('New' | 'Sale' | 'Limited')[] | undefined,
    category: dbProduct.category,
    description: dbProduct.description,
    specs: dbProduct.specs as Record<string, string> | undefined,
    variants: variants.length > 0 ? variants.map(v => ({
      id: v.id,
      color: v.color || undefined,
      size: v.size || undefined,
      stock: v.stock,
    })) : undefined,
  }
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    if (!supabase) {
      // Fallback to mock data if Supabase is not configured
      const productsData = await import('@/data/products.json')
      return productsData.default as Product[]
    }

    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    // Fetch variants for all products
    const productIds = products?.map(p => p.id) || []
    const { data: variants } = await supabase
      .from('product_variants')
      .select('*')
      .in('product_id', productIds)

    const variantsByProduct = variants?.reduce((acc, variant) => {
      if (!acc[variant.product_id]) acc[variant.product_id] = []
      acc[variant.product_id].push(variant)
      return acc
    }, {} as Record<string, any[]>) || {}

    return (products || []).map(product => 
      transformProduct(product, variantsByProduct[product.id] || [])
    )
  } catch (error) {
    console.error('Error fetching products:', error)
    // Fallback to mock data if Supabase fails
    const productsData = await import('@/data/products.json')
    return productsData.default as Product[]
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    if (!supabase) {
      const productsData = await import('@/data/products.json')
      return (productsData.default as Product[]).find(p => p.id === id) || null
    }

    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    if (!product) return null

    const { data: variants } = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', id)

    return transformProduct(product, variants || [])
  } catch (error) {
    console.error('Error fetching product by id:', error)
    // Fallback to mock data
    const productsData = await import('@/data/products.json')
    return (productsData.default as Product[]).find(p => p.id === id) || null
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    if (!supabase) {
      const productsData = await import('@/data/products.json')
      return (productsData.default as Product[]).find(p => p.slug === slug) || null
    }

    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) throw error
    if (!product) return null

    const { data: variants } = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', product.id)

    return transformProduct(product, variants || [])
  } catch (error) {
    console.error('Error fetching product by slug:', error)
    // Fallback to mock data
    const productsData = await import('@/data/products.json')
    return (productsData.default as Product[]).find(p => p.slug === slug) || null
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    if (!supabase) {
      const categoriesData = await import('@/data/categories.json')
      return categoriesData.default as Category[]
    }

    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error

    return (categories || []).map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description || undefined,
    }))
  } catch (error) {
    console.error('Error fetching categories:', error)
    // Fallback to mock data
    const categoriesData = await import('@/data/categories.json')
    return categoriesData.default as Category[]
  }
}

export async function fetchProductsByCategory(category: string): Promise<Product[]> {
  try {
    if (!supabase) {
      const productsData = await import('@/data/products.json')
      return (productsData.default as Product[]).filter(p => p.category === category)
    }

    // First, find category by slug
    const { data: categoryData } = await supabase
      .from('categories')
      .select('name')
      .eq('slug', category)
      .single()

    const categoryName = categoryData?.name || category

    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', categoryName)
      .order('created_at', { ascending: false })

    if (error) throw error

    const productIds = products?.map(p => p.id) || []
    const { data: variants } = await supabase
      .from('product_variants')
      .select('*')
      .in('product_id', productIds)

    const variantsByProduct = variants?.reduce((acc, variant) => {
      if (!acc[variant.product_id]) acc[variant.product_id] = []
      acc[variant.product_id].push(variant)
      return acc
    }, {} as Record<string, any[]>) || {}

    return (products || []).map(product => 
      transformProduct(product, variantsByProduct[product.id] || [])
    )
  } catch (error) {
    console.error('Error fetching products by category:', error)
    // Fallback to mock data
    const productsData = await import('@/data/products.json')
    return (productsData.default as Product[]).filter(p => p.category === category)
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  try {
    if (!supabase) {
      const productsData = await import('@/data/products.json')
      const lowerQuery = query.toLowerCase()
      return (productsData.default as Product[]).filter(
        p =>
          p.title.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery) ||
          p.category.toLowerCase().includes(lowerQuery)
      )
    }

    const searchPattern = `%${query}%`
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .or(`title.ilike."${searchPattern}",description.ilike."${searchPattern}",category.ilike."${searchPattern}"`)
      .order('created_at', { ascending: false })

    if (error) throw error

    const productIds = products?.map(p => p.id) || []
    const { data: variants } = await supabase
      .from('product_variants')
      .select('*')
      .in('product_id', productIds)

    const variantsByProduct = variants?.reduce((acc, variant) => {
      if (!acc[variant.product_id]) acc[variant.product_id] = []
      acc[variant.product_id].push(variant)
      return acc
    }, {} as Record<string, any[]>) || {}

    return (products || []).map(product => 
      transformProduct(product, variantsByProduct[product.id] || [])
    )
  } catch (error) {
    console.error('Error searching products:', error)
    // Fallback to mock data
    const productsData = await import('@/data/products.json')
    const lowerQuery = query.toLowerCase()
    return (productsData.default as Product[]).filter(
      p =>
        p.title.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
    )
  }
}

