import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Home } from '@/pages/Home'
import { Catalog } from '@/pages/Catalog'
import { ProductDetails } from '@/pages/Product'
import { Cart } from '@/pages/Cart'
import { Checkout } from '@/pages/Checkout'
import { Header } from '@/components/header/Header'
import { Footer } from '@/components/Footer'
import { Toaster } from '@/components/ui/toaster'
import { CartDrawerProvider } from '@/components/cart/CartDrawer'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <CartDrawerProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <Toaster />
    </CartDrawerProvider>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: '/products',
    element: (
      <Layout>
        <Catalog />
      </Layout>
    ),
  },
  {
    path: '/product/:slug',
    element: (
      <Layout>
        <ProductDetails />
      </Layout>
    ),
  },
  {
    path: '/cart',
    element: (
      <Layout>
        <Cart />
      </Layout>
    ),
  },
  {
    path: '/checkout',
    element: (
      <Layout>
        <Checkout />
      </Layout>
    ),
  },
])

export function Router() {
  return <RouterProvider router={router} />
}

