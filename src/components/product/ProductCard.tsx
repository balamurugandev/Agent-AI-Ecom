import { Star } from 'lucide-react'
import { formatPrice, formatRating } from '@/lib/format'
import type { Product } from '@/types'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cart'
import { useToast } from '@/hooks/use-toast'
import { Link } from 'react-router-dom'

export function Price({ price, compareAtPrice }: { price: number; compareAtPrice?: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg font-semibold">{formatPrice(price)}</span>
      {compareAtPrice && compareAtPrice > price && (
        <span className="text-sm text-muted-foreground line-through">
          {formatPrice(compareAtPrice)}
        </span>
      )}
    </div>
  )
}

export function Rating({ rating, ratingCount }: { rating: number; ratingCount: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : i < rating
                ? 'fill-yellow-200 text-yellow-200'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
      <span className="text-sm text-muted-foreground">
        {formatRating(rating)} ({ratingCount})
      </span>
    </div>
  )
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore(state => state.addItem)
  const { toast } = useToast()

  const handleAddToCart = () => {
    // If product has variants, we'd need to select one first
    // For now, just add the first variant or the product itself
    const variant = product.variants?.[0]
    addItem(product, variant ? {
      id: variant.id,
      color: variant.color,
      size: variant.size,
    } : undefined, 1)

    toast({
      title: 'Added to cart',
      description: `${product.title} has been added to your cart.`,
    })
  }

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
      <Link to={`/product/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.images[0]}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.badges && product.badges.length > 0 && (
            <div className="absolute top-2 left-2 flex gap-1">
              {product.badges.map(badge => (
                <Badge
                  key={badge}
                  variant={badge === 'Sale' ? 'destructive' : 'default'}
                  className="text-xs"
                >
                  {badge}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-semibold line-clamp-2 mb-2 hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>
        <Rating rating={product.rating} ratingCount={product.ratingCount} />
        <Price price={product.price} compareAtPrice={product.compareAtPrice} />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          className="w-full"
          size="sm"
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}

