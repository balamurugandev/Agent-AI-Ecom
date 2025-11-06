import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/format'
import { Link, useNavigate } from 'react-router-dom'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

function CartLine({ item }: { item: ReturnType<typeof useCartStore>['items'][0] }) {
  const updateQuantity = useCartStore(state => state.updateQuantity)
  const removeItem = useCartStore(state => state.removeItem)

  return (
    <div className="flex gap-4 py-6">
      <Link to={`/product/${item.slug}`}>
        <img
          src={item.image}
          alt={item.title}
          className="h-24 w-24 rounded-md object-cover hover:opacity-80 transition-opacity"
        />
      </Link>
      <div className="flex-1 space-y-2">
        <div>
          <Link to={`/product/${item.slug}`}>
            <h4 className="font-medium hover:text-primary transition-colors">{item.title}</h4>
          </Link>
          {item.variant && (
            <p className="text-sm text-muted-foreground">
              {item.variant.color && `Color: ${item.variant.color}`}
              {item.variant.size && ` • Size: ${item.variant.size}`}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => removeItem(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
        {item.quantity > 1 && (
          <p className="text-sm text-muted-foreground">
            {formatPrice(item.price)} each
          </p>
        )}
      </div>
    </div>
  )
}

function CartSummary() {
  const items = useCartStore(state => state.items)
  const subtotal = useCartStore(state => state.getSubtotal())
  const navigate = useNavigate()

  const shipping = subtotal > 100 ? 0 : 10
  const total = subtotal + shipping

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Order Summary</h2>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>
            {shipping === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              formatPrice(shipping)
            )}
          </span>
        </div>
        {subtotal < 100 && (
          <p className="text-xs text-muted-foreground">
            Add {formatPrice(100 - subtotal)} more for free shipping
          </p>
        )}
      </div>
      <Separator />
      <div className="flex justify-between font-semibold">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
      <Button
        className="w-full"
        size="lg"
        onClick={() => navigate('/checkout')}
        disabled={items.length === 0}
      >
        Proceed to Checkout
      </Button>
      <Button asChild variant="outline" className="w-full">
        <Link to="/products">Continue Shopping</Link>
      </Button>
    </div>
  )
}

export function Cart() {
  const items = useCartStore(state => state.items)

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
          <BreadcrumbPage>Shopping Cart</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Start adding items to your cart to see them here.
          </p>
          <Button asChild size="lg">
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <div key={item.id}>
                <CartLine item={item} />
                {index < items.length - 1 && <Separator />}
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <CartSummary />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

