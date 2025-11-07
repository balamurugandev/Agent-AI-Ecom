-- This file contains sample data to seed your database
-- Run this after running schema.sql

-- Note: You'll need to update the product IDs and variant IDs to match your actual UUIDs
-- You can use the products.json file to generate this data

-- Example: Insert a sample product
-- INSERT INTO products (id, title, slug, images, price, compare_at_price, rating, rating_count, badges, category, description, specs) VALUES
--   (
--     '11111111-1111-1111-1111-111111111111',
--     'Premium Wireless Headphones',
--     'premium-wireless-headphones',
--     ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
--     199.99,
--     249.99,
--     4.5,
--     324,
--     ARRAY['Sale', 'New'],
--     'Electronics',
--     'High-quality wireless headphones with noise cancellation and premium sound quality.',
--     '{"Battery Life": "30 hours", "Connectivity": "Bluetooth 5.0", "Weight": "250g"}'::jsonb
--   )
-- ON CONFLICT (id) DO NOTHING;

-- Example: Insert product variants
-- INSERT INTO product_variants (id, product_id, color, size, stock) VALUES
--   ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Black', NULL, 15),
--   ('22222222-2222-2222-2222-222222222223', '11111111-1111-1111-1111-111111111111', 'White', NULL, 8),
--   ('22222222-2222-2222-2222-222222222224', '11111111-1111-1111-1111-111111111111', 'Blue', NULL, 12)
-- ON CONFLICT DO NOTHING;

-- To seed your database with all products from products.json:
-- 1. Convert the JSON data to SQL INSERT statements
-- 2. Or use a script to import the JSON data
-- 3. Or use Supabase Dashboard to import CSV/JSON

