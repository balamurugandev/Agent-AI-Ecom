import type { Product, Category } from '@/types'

// Simulate API latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock products data
import productsData from '@/data/products.json'
import categoriesData from '@/data/categories.json'

export async function fetchProducts(): Promise<Product[]> {
  await delay(300)
  return productsData as Product[]
}

export async function fetchProductById(id: string): Promise<Product | null> {
  await delay(200)
  const product = (productsData as Product[]).find(p => p.id === id)
  return product || null
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  await delay(200)
  const product = (productsData as Product[]).find(p => p.slug === slug)
  return product || null
}

export async function fetchCategories(): Promise<Category[]> {
  await delay(200)
  return categoriesData as Category[]
}

export async function fetchProductsByCategory(category: string): Promise<Product[]> {
  await delay(300)
  return (productsData as Product[]).filter(p => p.category === category)
}

export async function searchProducts(query: string): Promise<Product[]> {
  await delay(300)
  const lowerQuery = query.toLowerCase()
  return (productsData as Product[]).filter(
    p =>
      p.title.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery)
  )
}

