import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product/ProductCard'
import { fetchProducts } from '@/lib/api'
import { useEffect, useState } from 'react'
import type { Product } from '@/types'
import { Skeleton } from '@/components/ui/skeleton'

export function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts().then(data => {
      setProducts(data)
      setLoading(false)
    })
  }, [])

  const bestSellers = products.slice(0, 8)
  const featured = products.slice(8, 12)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 to-primary/5 py-20 md:py-32">
        <div className="container max-w-7xl">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Discover Your Style
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl lg:text-2xl">
              Shop the latest trends in fashion, electronics, and accessories. 
              Quality products at unbeatable prices.
            </p>
            <div className="flex gap-4">
              <Button asChild size="lg">
                <Link to="/products">Shop Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/products?category=sale">View Sale</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-12 md:py-16">
        <div className="container max-w-7xl">
          <h2 className="text-3xl font-bold mb-8 lg:text-4xl">Featured Collections</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 lg:gap-8">
            {[
              { name: 'New Arrivals', slug: 'new-arrivals', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800' },
              { name: 'Men', slug: 'men', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800' },
              { name: 'Women', slug: 'women', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800' },
              { name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800' },
            ].map(collection => (
              <Link
                key={collection.slug}
                to={`/products?category=${collection.slug}`}
                className="group relative overflow-hidden rounded-2xl aspect-square"
              >
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                  <h3 className="text-2xl font-bold text-white">{collection.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="container max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold lg:text-4xl">Best Sellers</h2>
            <Button asChild variant="outline">
              <Link to="/products">View All</Link>
            </Button>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-square w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
              {bestSellers.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-12 md:py-16">
        <div className="container max-w-7xl">
          <h2 className="text-3xl font-bold mb-8 lg:text-4xl">Shop by Category</h2>
          <div className="flex flex-wrap gap-4">
            {[
              'New Arrivals',
              'Men',
              'Women',
              'Electronics',
              'Accessories',
              'Sale',
            ].map(category => (
              <Button
                key={category}
                asChild
                variant="outline"
                size="lg"
                className="rounded-full"
              >
                <Link to={`/products?category=${category.toLowerCase().replace(' ', '-')}`}>
                  {category}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

