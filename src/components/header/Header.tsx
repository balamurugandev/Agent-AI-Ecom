import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Moon, Sun, User, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SearchBar } from './SearchBar'
import { CartButton } from './CartButton'

export function Header() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl flex h-16 items-center gap-4 lg:gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl lg:text-2xl">
          <span>Shop</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8">
          <Link to="/products?category=new-arrivals" className="text-sm font-medium hover:text-primary transition-colors lg:text-base">
            New Arrivals
          </Link>
          <Link to="/products?category=men" className="text-sm font-medium hover:text-primary transition-colors lg:text-base">
            Men
          </Link>
          <Link to="/products?category=women" className="text-sm font-medium hover:text-primary transition-colors lg:text-base">
            Women
          </Link>
          <Link to="/products?category=electronics" className="text-sm font-medium hover:text-primary transition-colors lg:text-base">
            Electronics
          </Link>
          <Link to="/products?category=accessories" className="text-sm font-medium hover:text-primary transition-colors lg:text-base">
            Accessories
          </Link>
          <Link to="/products?category=sale" className="text-sm font-medium text-destructive hover:text-destructive/80 transition-colors lg:text-base">
            Sale
          </Link>
        </nav>

        {/* Search Bar */}
        <SearchBar />

        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>

          <Button variant="ghost" size="icon" aria-label="Wishlist">
            <Heart className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Account">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Sign In</DropdownMenuItem>
              <DropdownMenuItem>Create Account</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <CartButton />
        </div>
      </div>
    </header>
  )
}

