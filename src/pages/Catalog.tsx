import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { ProductCard } from '@/components/product/ProductCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { fetchProducts, searchProducts, fetchProductsByCategory } from '@/lib/api'
import type { Product, SortOption, FilterState } from '@/types'
import { Skeleton } from '@/components/ui/skeleton'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

const ITEMS_PER_PAGE = 12

export function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const category = searchParams.get('category') || ''
  const searchQuery = searchParams.get('search') || ''
  const sort = (searchParams.get('sort') || 'relevance') as SortOption

  const [filters, setFilters] = useState<FilterState>({
    minPrice: undefined,
    maxPrice: undefined,
    minRating: undefined,
    inStock: undefined,
  })

  useEffect(() => {
    setLoading(true)
    const loadProducts = async () => {
      let data: Product[] = []
      if (searchQuery) {
        data = await searchProducts(searchQuery)
      } else if (category) {
        data = await fetchProductsByCategory(category)
      } else {
        data = await fetchProducts()
      }
      setProducts(data)
      setLoading(false)
    }
    loadProducts()
  }, [category, searchQuery])

  const filteredAndSorted = useMemo(() => {
    let result = [...products]

    // Apply filters
    if (filters.minPrice !== undefined) {
      result = result.filter(p => p.price >= filters.minPrice!)
    }
    if (filters.maxPrice !== undefined) {
      result = result.filter(p => p.price <= filters.maxPrice!)
    }
    if (filters.minRating !== undefined) {
      result = result.filter(p => p.rating >= filters.minRating!)
    }
    if (filters.inStock) {
      result = result.filter(p => {
        if (!p.variants || p.variants.length === 0) return true
        return p.variants.some(v => v.stock > 0)
      })
    }

    // Apply sorting
    switch (sort) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        // Assuming newer products have higher IDs
        result.sort((a, b) => b.id.localeCompare(a.id))
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      default:
        // relevance - keep original order
        break
    }

    return result
  }, [products, filters, sort])

  const totalPages = Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE)
  const paginatedProducts = filteredAndSorted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [category, searchQuery, filters, sort])

  const maxPrice = Math.max(...products.map(p => p.price), 1000)
  const [priceRange, setPriceRange] = useState([0, maxPrice])

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
          <BreadcrumbPage>Products</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex gap-8 lg:gap-12">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block w-64 xl:w-72 shrink-0">
          <div className="sticky top-20 space-y-6">
            <h2 className="text-lg font-semibold">Filters</h2>
            
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="price">
                <AccordionTrigger>Price</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <Slider
                      value={priceRange}
                      onValueChange={(value) => {
                        setPriceRange(value)
                        setFilters(prev => ({
                          ...prev,
                          minPrice: value[0],
                          maxPrice: value[1],
                        }))
                      }}
                      max={maxPrice}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="rating">
                <AccordionTrigger>Rating</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map(rating => (
                      <div key={rating} className="flex items-center space-x-2">
                        <Checkbox
                          id={`rating-${rating}`}
                          checked={filters.minRating === rating}
                          onCheckedChange={(checked) => {
                            setFilters(prev => ({
                              ...prev,
                              minRating: checked ? rating : undefined,
                            }))
                          }}
                        />
                        <label
                          htmlFor={`rating-${rating}`}
                          className="text-sm cursor-pointer"
                        >
                          {rating}+ Stars
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="stock">
                <AccordionTrigger>Availability</AccordionTrigger>
                <AccordionContent>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="in-stock"
                      checked={filters.inStock || false}
                      onCheckedChange={(checked) => {
                        setFilters(prev => ({
                          ...prev,
                          inStock: checked ? true : undefined,
                        }))
                      }}
                    />
                    <label htmlFor="in-stock" className="text-sm cursor-pointer">
                      In Stock Only
                    </label>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 flex flex-col p-0">
                <div className="px-6 pt-6 pb-4 border-b">
                  <h2 className="text-lg font-semibold">Filters</h2>
                </div>
                <ScrollArea className="flex-1 px-6">
                  <div className="py-4">
                    <Accordion type="multiple" className="w-full">
                      <AccordionItem value="price">
                        <AccordionTrigger>Price</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <Slider
                              value={priceRange}
                              onValueChange={(value) => {
                                setPriceRange(value)
                                setFilters(prev => ({
                                  ...prev,
                                  minPrice: value[0],
                                  maxPrice: value[1],
                                }))
                              }}
                              max={maxPrice}
                              step={10}
                              className="w-full"
                            />
                            <div className="flex justify-between text-sm">
                              <span>${priceRange[0]}</span>
                              <span>${priceRange[1]}</span>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="rating">
                        <AccordionTrigger>Rating</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            {[4, 3, 2, 1].map(rating => (
                              <div key={rating} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`mobile-rating-${rating}`}
                                  checked={filters.minRating === rating}
                                  onCheckedChange={(checked) => {
                                    setFilters(prev => ({
                                      ...prev,
                                      minRating: checked ? rating : undefined,
                                    }))
                                  }}
                                />
                                <label
                                  htmlFor={`mobile-rating-${rating}`}
                                  className="text-sm cursor-pointer"
                                >
                                  {rating}+ Stars
                                </label>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="stock">
                        <AccordionTrigger>Availability</AccordionTrigger>
                        <AccordionContent>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="mobile-in-stock"
                              checked={filters.inStock || false}
                              onCheckedChange={(checked) => {
                                setFilters(prev => ({
                                  ...prev,
                                  inStock: checked ? true : undefined,
                                }))
                              }}
                            />
                            <label htmlFor="mobile-in-stock" className="text-sm cursor-pointer">
                              In Stock Only
                            </label>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>

            {/* Sort */}
            <div className="ml-auto">
              <Select
                value={sort}
                onValueChange={(value) => {
                  setSearchParams(prev => {
                    const newParams = new URLSearchParams(prev)
                    newParams.set('sort', value)
                    return newParams
                  })
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Grid */}
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
          ) : paginatedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground text-lg mb-4">No products found</p>
              <Button asChild variant="outline">
                <Link to="/products">Clear Filters</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 mb-8">
                {paginatedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? 'default' : 'outline'}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

