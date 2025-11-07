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
- **Database**: Supabase (PostgreSQL)
- **Backend**: Supabase (REST API, Real-time, Auth)

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- pnpm (recommended) or npm/yarn
- A Supabase account ([Sign up for free](https://supabase.com))

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

3. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to **Settings** → **API** and copy your **Project URL** and **anon key**
   - Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
   - Run the database schema (see [Supabase Setup](#supabase-setup) below)

4. Start the development server:
```bash
pnpm dev
```

5. Open your browser and navigate to `http://localhost:5173`

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

## Supabase Setup

The app is configured to use Supabase as the backend. Follow these steps to set up your database:

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the project to be provisioned (takes ~2 minutes)

### 2. Configure Environment Variables

1. In your Supabase project, go to **Settings** → **API**
2. Copy your **Project URL** and **anon/public key**
3. Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Set Up Database Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase/schema.sql`
4. Click **Run** to execute the schema

This creates:
- `categories` table
- `products` table  
- `product_variants` table
- Indexes for performance
- Row Level Security (RLS) policies

### 4. Seed Your Database

You have several options:

**Option A: Use the seeding script**
```bash
# Install tsx if needed
npm install -D tsx

# Run the seed script
npx tsx scripts/seed-database.ts
```

**Option B: Use Supabase Dashboard**
1. Go to **Table Editor**
2. Manually add data or import CSV/JSON files

**Option C: Use SQL**
- See `supabase/seed.sql` for examples

For detailed instructions, see [supabase/README.md](./supabase/README.md)

### 5. Verify Setup

- Check that tables exist in **Table Editor**
- Verify RLS policies in **Authentication** → **Policies**
- Test queries in **SQL Editor**

### Fallback to Mock Data

If Supabase is not configured or unavailable, the app automatically falls back to the mock JSON data files. This allows the app to work without a database for development/testing.

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

