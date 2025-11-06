import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { ProductCard, Price, Rating } from '@/components/product/ProductCard'
import { useCartStore } from '@/store/cart'
import { useToast } from '@/hooks/use-toast'
import { useCartDrawer } from '@/components/cart/CartDrawer'
import { fetchProductBySlug, fetchProducts } from '@/lib/api'
import type { Product } from '@/types'
import { Skeleton } from '@/components/ui/skeleton'
import { Minus, Plus, ShoppingBag } from 'lucide-react'

export function ProductDetails() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])

  const addItem = useCartStore(state => state.addItem)
  const { toast } = useToast()
  const { openCart } = useCartDrawer()

  useEffect(() => {
    if (!slug) return
    fetchProductBySlug(slug).then(data => {
      if (data) {
        setProduct(data)
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0].id)
        }
        // Fetch related products
        fetchProducts().then(allProducts => {
          const related = allProducts
            .filter(p => p.category === data.category && p.id !== data.id)
            .slice(0, 4)
          setRelatedProducts(related)
        })
      }
      setLoading(false)
    })
  }, [slug])

  const handleAddToCart = () => {
    if (!product) return

    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      toast({
        title: 'Please select a variant',
        description: 'Choose a size or color before adding to cart.',
        variant: 'destructive',
      })
      return
    }

    const variant = product.variants?.find(v => v.id === selectedVariant)
    addItem(product, variant ? {
      id: variant.id,
      color: variant.color,
      size: variant.size,
    } : undefined, quantity)

    toast({
      title: 'Added to cart',
      description: `${product.title} has been added to your cart.`,
    })
    openCart()
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate('/checkout')
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container max-w-7xl py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Button asChild>
          <Link to="/products">Back to Products</Link>
        </Button>
      </div>
    )
  }

  const selectedVariantData = product.variants?.find(v => v.id === selectedVariant)
  const availableSizes = product.variants?.filter(v => v.size).map(v => v.size) || []
  const availableColors = product.variants?.filter(v => v.color).map(v => v.color) || []
  const uniqueSizes = [...new Set(availableSizes)]
  const uniqueColors = [...new Set(availableColors)]

  return (
    <div className="container max-w-7xl py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/products">Products</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage>{product.title}</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-20 mb-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
            <img
              src={product.images[selectedImage]}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} view ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <Rating rating={product.rating} ratingCount={product.ratingCount} />
          </div>

          <Price price={product.price} compareAtPrice={product.compareAtPrice} />

          {product.badges && product.badges.length > 0 && (
            <div className="flex gap-2">
              {product.badges.map(badge => (
                <span
                  key={badge}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}

          <Separator />

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-4">
              {uniqueSizes.length > 0 && (
                <div>
                  <Label className="mb-2 block">Size</Label>
                  <Select
                    value={selectedVariant}
                    onValueChange={setSelectedVariant}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.variants
                        .filter(v => v.size)
                        .map(variant => (
                          <SelectItem
                            key={variant.id}
                            value={variant.id}
                            disabled={variant.stock === 0}
                          >
                            {variant.size} {variant.stock === 0 && '(Out of Stock)'}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {uniqueColors.length > 0 && (
                <div>
                  <Label className="mb-2 block">Color</Label>
                  <RadioGroup
                    value={selectedVariant}
                    onValueChange={setSelectedVariant}
                    className="flex gap-2"
                  >
                    {product.variants
                      .filter(v => v.color)
                      .map(variant => (
                        <div key={variant.id} className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={variant.id}
                            id={variant.id}
                            disabled={variant.stock === 0}
                          />
                          <Label
                            htmlFor={variant.id}
                            className="cursor-pointer"
                          >
                            {variant.color} {variant.stock === 0 && '(Out of Stock)'}
                          </Label>
                        </div>
                      ))}
                  </RadioGroup>
                </div>
              )}

              {selectedVariantData && (
                <p className="text-sm text-muted-foreground">
                  {selectedVariantData.stock > 0
                    ? `${selectedVariantData.stock} in stock`
                    : 'Out of stock'}
                </p>
              )}
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <Label>Quantity</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(prev => prev + 1)}
                disabled={selectedVariantData ? selectedVariantData.stock < quantity + 1 : false}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={selectedVariantData ? selectedVariantData.stock === 0 : false}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleBuyNow}
              disabled={selectedVariantData ? selectedVariantData.stock === 0 : false}
            >
              Buy Now
            </Button>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground">{product.description}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="description" className="mb-16">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-6">
          <p className="text-muted-foreground">{product.description}</p>
        </TabsContent>
        <TabsContent value="details" className="mt-6">
          {product.specs && Object.keys(product.specs).length > 0 ? (
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key}>
                  <dt className="font-medium">{key}</dt>
                  <dd className="text-muted-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-muted-foreground">No additional details available.</p>
          )}
        </TabsContent>
        <TabsContent value="reviews" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Rating rating={product.rating} ratingCount={product.ratingCount} />
            </div>
            <p className="text-muted-foreground">
              Customer reviews coming soon. Be the first to review this product!
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6 lg:text-3xl">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {relatedProducts.map(relatedProduct => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

