-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  images TEXT[] NOT NULL DEFAULT '{}',
  price DECIMAL(10, 2) NOT NULL,
  compare_at_price DECIMAL(10, 2),
  rating DECIMAL(3, 2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  rating_count INTEGER DEFAULT 0,
  badges TEXT[],
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  specs JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (category) REFERENCES categories(name) ON DELETE RESTRICT
);

-- Product variants table
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  color TEXT,
  size TEXT,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, color, size)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on product_variants"
  ON product_variants FOR SELECT
  USING (true);

-- Insert sample categories
INSERT INTO categories (id, name, slug, description) VALUES
  ('00000000-0000-0000-0000-000000000001', 'New Arrivals', 'new-arrivals', 'Latest products just in'),
  ('00000000-0000-0000-0000-000000000002', 'Men', 'men', 'Men''s clothing and accessories'),
  ('00000000-0000-0000-0000-000000000003', 'Women', 'women', 'Women''s clothing and accessories'),
  ('00000000-0000-0000-0000-000000000004', 'Electronics', 'electronics', 'Latest tech gadgets'),
  ('00000000-0000-0000-0000-000000000005', 'Accessories', 'accessories', 'Fashion and lifestyle accessories'),
  ('00000000-0000-0000-0000-000000000006', 'Sale', 'sale', 'Special deals and discounts')
ON CONFLICT (id) DO NOTHING;

