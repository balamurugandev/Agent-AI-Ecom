import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { debounce } from '@/lib/debounce'

interface SearchBarProps {
  onSearch?: (query: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const debouncedSearch = debounce((value: string) => {
    if (onSearch) {
      onSearch(value)
    } else {
      if (value.trim()) {
        navigate(`/products?search=${encodeURIComponent(value)}`)
      }
    }
  }, 300)

  useEffect(() => {
    debouncedSearch(query)
  }, [query])

  return (
    <div className="relative flex-1 max-w-lg mx-4">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10"
      />
    </div>
  )
}

