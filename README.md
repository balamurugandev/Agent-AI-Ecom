# Modern E-commerce Web App

A production-ready, responsive e-commerce web application built with React, TypeScript, Vite, Tailwind CSS, and shadcn/ui.

## Features

- 🛍️ **Full Shopping Experience**: Browse products, add to cart, and checkout
- 🎨 **Modern UI**: Clean, responsive design with dark/light theme support
- 🔍 **Advanced Search & Filters**: Search products, filter by category, price, rating, and availability
- 🛒 **Shopping Cart**: Persistent cart with localStorage, slide-over drawer, and quantity management
- 📱 **Fully Responsive**: Mobile-first design that works on all screen sizes
- ⚡ **Fast Performance**: Built with Vite for optimal build times and HMR
- 🎯 **Type-Safe**: Full TypeScript support with strict mode
- ♿ **Accessible**: WCAG-compliant components with proper ARIA attributes

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **State Management**: Zustand with localStorage persistence
- **Routing**: React Router v6
- **Form Handling**: Native HTML5 forms with validation

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- pnpm (recommended) or npm/yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Agent-ai-test
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
pnpm build
```

The production build will be in the `dist` directory.

### Preview Production Build

```bash
pnpm preview
```

## Project Structure

```
src/
├── app/
│   ├── main.tsx          # Application entry point
│   └── router.tsx        # React Router configuration
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── header/           # Header components
│   ├── product/          # Product-related components
│   └── cart/             # Cart components
├── pages/
│   ├── Home.tsx          # Home page
│   ├── Catalog.tsx       # Product catalog with filters
│   ├── Product.tsx       # Product details page
│   ├── Cart.tsx          # Shopping cart page
│   └── Checkout.tsx      # Checkout flow
├── store/
│   └── cart.ts           # Zustand cart store
├── lib/
│   ├── api.ts            # Mock API functions
│   ├── cn.ts             # className utility
│   ├── debounce.ts       # Debounce utility
│   └── format.ts         # Formatting utilities
├── types/
│   └── index.ts          # TypeScript type definitions
├── data/
│   ├── products.json     # Mock product data
│   └── categories.json   # Mock category data
└── styles/
    └── globals.css       # Global styles and Tailwind directives
```

## Extending Products

Products are stored in `src/data/products.json`. To add new products:

1. Open `src/data/products.json`
2. Add a new product object following the existing structure:

```json
{
  "id": "prod-XX",
  "title": "Product Name",
  "slug": "product-name",
  "images": ["https://..."],
  "price": 99.99,
  "compareAtPrice": 129.99,
  "rating": 4.5,
  "ratingCount": 100,
  "badges": ["New", "Sale"],
  "category": "Electronics",
  "variants": [
    {
      "id": "v-XX-1",
      "color": "Black",
      "size": "M",
      "stock": 10
    }
  ],
  "description": "Product description",
  "specs": {
    "Material": "Cotton",
    "Care": "Machine washable"
  }
}
```

## Switching to a Real API

The app currently uses mock data with simulated latency. To switch to a real API:

1. Update `src/lib/api.ts` to replace mock functions with actual API calls:

```typescript
export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch('https://api.example.com/products')
  return response.json()
}
```

2. Update environment variables if needed (create `.env` file):

```env
VITE_API_URL=https://api.example.com
```

3. Update API calls to use the environment variable:

```typescript
const API_URL = import.meta.env.VITE_API_URL

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products`)
  return response.json()
}
```

## Key Features Explained

### Cart Management
- Cart state is managed with Zustand and persisted to localStorage
- Adding the same product with the same variant increases quantity instead of duplicating
- Cart drawer opens automatically when items are added
- Cart persists across page reloads

### Product Variants
- Products can have variants (size, color, etc.)
- Variant selection is required before adding to cart
- Stock levels are displayed per variant

### Search & Filters
- Debounced search for better performance
- Multiple filter options: category, price range, rating, stock status
- Filters persist in URL query parameters
- Client-side filtering and sorting for fast UX

### Responsive Design
- Mobile-first approach
- Filters collapse to a drawer on mobile
- Sticky header and cart drawer
- Optimized layouts for all screen sizes

## Performance Optimizations

- Code splitting with React Router
- Lazy loading for images
- Debounced search input
- Memoized filter/sort calculations
- Optimized re-renders with Zustand selectors

## Accessibility

- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader friendly

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

