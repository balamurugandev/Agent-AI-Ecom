export type Product = {
  id: string
  title: string
  slug: string
  images: string[]
  price: number
  compareAtPrice?: number
  rating: number // 0-5
  ratingCount: number
  badges?: ('New' | 'Sale' | 'Limited')[]
  category: string
  variants?: {
    id: string
    color?: string
    size?: string
    stock: number
  }[]
  description: string
  specs?: Record<string, string>
}

export type Category = {
  id: string
  name: string
  slug: string
  description?: string
}

export type CartItem = {
  id: string // unique cart item id
  productId: string
  slug: string
  title: string
  image: string
  price: number
  quantity: number
  variant?: {
    id: string
    color?: string
    size?: string
  }
}

export type SortOption = 'relevance' | 'price-low' | 'price-high' | 'newest' | 'rating'

export type FilterState = {
  category?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  inStock?: boolean
}

