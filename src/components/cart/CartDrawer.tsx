import { createContext, useContext, useState, ReactNode } from 'react'
import { CartDrawerComponent } from './CartDrawerComponent'

interface CartDrawerContextType {
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartDrawerContext = createContext<CartDrawerContextType | undefined>(undefined)

export function CartDrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <CartDrawerContext.Provider
      value={{
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
      }}
    >
      {children}
      <CartDrawerComponent />
    </CartDrawerContext.Provider>
  )
}

export function useCartDrawer() {
  const context = useContext(CartDrawerContext)
  if (!context) {
    throw new Error('useCartDrawer must be used within CartDrawerProvider')
  }
  return context
}

