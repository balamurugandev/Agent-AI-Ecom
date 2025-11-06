import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/format'
import { CheckCircle2, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

type Step = 'shipping' | 'payment' | 'success'

export function Checkout() {
  const navigate = useNavigate()
  const items = useCartStore(state => state.items)
  const subtotal = useCartStore(state => state.getSubtotal())
  const clear = useCartStore(state => state.clear)
  const [step, setStep] = useState<Step>('shipping')

  const [shippingForm, setShippingForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
  })

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateShipping = () => {
    const newErrors: Record<string, string> = {}
    if (!shippingForm.firstName) newErrors.firstName = 'Required'
    if (!shippingForm.lastName) newErrors.lastName = 'Required'
    if (!shippingForm.email) newErrors.email = 'Required'
    if (!shippingForm.address) newErrors.address = 'Required'
    if (!shippingForm.city) newErrors.city = 'Required'
    if (!shippingForm.state) newErrors.state = 'Required'
    if (!shippingForm.zip) newErrors.zip = 'Required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePayment = () => {
    const newErrors: Record<string, string> = {}
    if (!paymentForm.cardNumber) newErrors.cardNumber = 'Required'
    if (!paymentForm.expiryDate) newErrors.expiryDate = 'Required'
    if (!paymentForm.cvv) newErrors.cvv = 'Required'
    if (!paymentForm.cardName) newErrors.cardName = 'Required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateShipping()) {
      setStep('payment')
    }
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validatePayment()) {
      // Mock order submission
      clear()
      setStep('success')
    }
  }

  const shipping = subtotal > 100 ? 0 : 10
  const total = subtotal + shipping

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="container max-w-7xl py-8 text-center">
        <p className="text-muted-foreground mb-4">Your cart is empty</p>
        <Button asChild>
          <Link to="/products">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="container max-w-7xl py-16">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto" />
          <h1 className="text-3xl font-bold">Order Placed Successfully!</h1>
          <p className="text-muted-foreground">
            Thank you for your order. We've sent a confirmation email with your order details.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/products">Continue Shopping</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

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
              <Link to="/cart">Cart</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage>Checkout</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Checkout</h1>
              <p className="text-muted-foreground">
                Step {step === 'shipping' ? '1' : '2'} of 2
              </p>
            </div>
          </div>

          {step === 'shipping' ? (
            <form onSubmit={handleShippingSubmit} className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={shippingForm.firstName}
                      onChange={(e) => setShippingForm(prev => ({ ...prev, firstName: e.target.value }))}
                      className={errors.firstName ? 'border-destructive' : ''}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-destructive mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={shippingForm.lastName}
                      onChange={(e) => setShippingForm(prev => ({ ...prev, lastName: e.target.value }))}
                      className={errors.lastName ? 'border-destructive' : ''}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-destructive mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={shippingForm.email}
                    onChange={(e) => setShippingForm(prev => ({ ...prev, email: e.target.value }))}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">{errors.email}</p>
                  )}
                </div>
                <div className="mt-4">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={shippingForm.phone}
                    onChange={(e) => setShippingForm(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="mt-4">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={shippingForm.address}
                    onChange={(e) => setShippingForm(prev => ({ ...prev, address: e.target.value }))}
                    className={errors.address ? 'border-destructive' : ''}
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive mt-1">{errors.address}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={shippingForm.city}
                      onChange={(e) => setShippingForm(prev => ({ ...prev, city: e.target.value }))}
                      className={errors.city ? 'border-destructive' : ''}
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive mt-1">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={shippingForm.state}
                      onChange={(e) => setShippingForm(prev => ({ ...prev, state: e.target.value }))}
                      className={errors.state ? 'border-destructive' : ''}
                    />
                    {errors.state && (
                      <p className="text-sm text-destructive mt-1">{errors.state}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input
                      id="zip"
                      value={shippingForm.zip}
                      onChange={(e) => setShippingForm(prev => ({ ...prev, zip: e.target.value }))}
                      className={errors.zip ? 'border-destructive' : ''}
                    />
                    {errors.zip && (
                      <p className="text-sm text-destructive mt-1">{errors.zip}</p>
                    )}
                  </div>
                </div>
              </div>
              <Button type="submit" size="lg" className="w-full">
                Continue to Payment
              </Button>
            </form>
          ) : (
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
                <div className="mt-4">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={paymentForm.cardNumber}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, cardNumber: e.target.value }))}
                    className={errors.cardNumber ? 'border-destructive' : ''}
                  />
                  {errors.cardNumber && (
                    <p className="text-sm text-destructive mt-1">{errors.cardNumber}</p>
                  )}
                </div>
                <div className="mt-4">
                  <Label htmlFor="cardName">Name on Card</Label>
                  <Input
                    id="cardName"
                    value={paymentForm.cardName}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, cardName: e.target.value }))}
                    className={errors.cardName ? 'border-destructive' : ''}
                  />
                  {errors.cardName && (
                    <p className="text-sm text-destructive mt-1">{errors.cardName}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={paymentForm.expiryDate}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                      className={errors.expiryDate ? 'border-destructive' : ''}
                    />
                    {errors.expiryDate && (
                      <p className="text-sm text-destructive mt-1">{errors.expiryDate}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={paymentForm.cvv}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, cvv: e.target.value }))}
                      className={errors.cvv ? 'border-destructive' : ''}
                    />
                    {errors.cvv && (
                      <p className="text-sm text-destructive mt-1">{errors.cvv}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => setStep('shipping')}>
                  Back
                </Button>
                <Button type="submit" size="lg" className="flex-1">
                  Place Order
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 bg-card border rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <div className="space-y-2">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.title} × {item.quantity}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <Separator />
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
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

