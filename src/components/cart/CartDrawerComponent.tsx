import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/format'
import { useNavigate, Link } from 'react-router-dom'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { useCartDrawer } from './CartDrawer'
import { ScrollArea } from '@/components/ui/scroll-area'

function CartLine({ item }: { item: ReturnType<typeof useCartStore>['items'][0] }) {
  const updateQuantity = useCartStore(state => state.updateQuantity)
  const removeItem = useCartStore(state => state.removeItem)

  return (
    <div className="flex gap-4 py-4">
      <Link to={`/product/${item.slug}`}>
        <img
          src={item.image}
          alt={item.title}
          className="h-20 w-20 rounded-md object-cover hover:opacity-80 transition-opacity"
        />
      </Link>
      <div className="flex-1 space-y-1">
        <Link to={`/product/${item.slug}`}>
          <h4 className="text-sm font-medium hover:text-primary transition-colors">{item.title}</h4>
        </Link>
        {item.variant && (
          <p className="text-xs text-muted-foreground">
            {item.variant.color && `Color: ${item.variant.color}`}
            {item.variant.size && ` • Size: ${item.variant.size}`}
          </p>
        )}
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
      </div>
      <div className="flex flex-col items-end justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => removeItem(item.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
      </div>
    </div>
  )
}

function CartSummary() {
  const items = useCartStore(state => state.items)
  const subtotal = useCartStore(state => state.getSubtotal())
  const navigate = useNavigate()
  const { closeCart } = useCartDrawer()

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">Your cart is empty</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Shipping calculated at checkout
        </p>
      </div>
      <Separator />
      <Button
        className="w-full"
        size="lg"
        onClick={() => {
          closeCart()
          navigate('/checkout')
        }}
      >
        Checkout
      </Button>
    </div>
  )
}

export function CartDrawerComponent() {
  const items = useCartStore(state => state.items)
  const { isOpen, closeCart } = useCartDrawer()

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </SheetDescription>
        </SheetHeader>
        
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12 px-6 text-center">
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Button onClick={closeCart} variant="outline">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6">
              <div className="space-y-4 py-4">
                {items.map((item, index) => (
                  <div key={item.id}>
                    <CartLine item={item} />
                    {index < items.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="border-t px-6 py-4 pb-6 mt-auto bg-background">
              <CartSummary />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

