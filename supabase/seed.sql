-- ============================================================
-- ModernShop – Seed Data
-- Run AFTER schema.sql in the Supabase SQL Editor.
-- ============================================================
-- NOTE: In production the profile rows are created automatically
-- via a Supabase Auth trigger.  For the demo we insert them
-- manually together with matching auth.users entries.
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- 1.  DEMO USERS  (auth.users + profiles)
-- ──────────────────────────────────────────────────────────────
-- We use deterministic UUIDs so every FK stays consistent.

insert into auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
values
  ('11111111-1111-1111-1111-111111111111', 'alex@example.com',    crypt('password123', gen_salt('bf')), now(), '{"name":"Alex Johnson"}'),
  ('22222222-2222-2222-2222-222222222222', 'jordan@example.com',  crypt('password123', gen_salt('bf')), now(), '{"name":"Jordan Smith"}'),
  ('33333333-3333-3333-3333-333333333333', 'taylor@example.com',  crypt('password123', gen_salt('bf')), now(), '{"name":"Taylor Morgan"}'),
  ('44444444-4444-4444-4444-444444444444', 'casey@example.com',   crypt('password123', gen_salt('bf')), now(), '{"name":"Casey Lee"}'),
  ('55555555-5555-5555-5555-555555555555', 'riley@example.com',   crypt('password123', gen_salt('bf')), now(), '{"name":"Riley Davis"}');

insert into profiles (id, name, email, initials) values
  ('11111111-1111-1111-1111-111111111111', 'Alex Johnson',   'alex@example.com',   'AJ'),
  ('22222222-2222-2222-2222-222222222222', 'Jordan Smith',   'jordan@example.com', 'JS'),
  ('33333333-3333-3333-3333-333333333333', 'Taylor Morgan',  'taylor@example.com', 'TM'),
  ('44444444-4444-4444-4444-444444444444', 'Casey Lee',      'casey@example.com',  'CL'),
  ('55555555-5555-5555-5555-555555555555', 'Riley Davis',    'riley@example.com',  'RD');

-- ──────────────────────────────────────────────────────────────
-- 2.  PRODUCTS  (12 items matching mockProducts)
-- ──────────────────────────────────────────────────────────────
insert into products (id, name, price, description, image, category, badge, in_stock) values
  ('aaaaaaaa-0001-0001-0001-aaaaaaaaaaaa', 'Artisan Garden Salad',              1.00, 'Freshly picked organic greens, cherry tomatoes, and balsamic glaze.',                      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',  'Food',        'NEW',       true),
  ('aaaaaaaa-0002-0002-0002-aaaaaaaaaaaa', 'Premium Cotton Tee',                1.00, 'Ultra-soft 100% sustainable cotton. Available in 5 colors.',                                'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',  'Clothing',    null,        true),
  ('aaaaaaaa-0003-0003-0003-aaaaaaaaaaaa', 'Citrus Fusion Soda',                1.00, 'Natural sparkling water with cold-pressed orange and lime.',                                 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',  'Drinks',      null,        true),
  ('aaaaaaaa-0004-0004-0004-aaaaaaaaaaaa', 'Classic Craft Burger',              1.00, 'Grass-fed beef, aged cheddar, and house sauce on brioche.',                                 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',  'Food',        null,        true),
  ('aaaaaaaa-0005-0005-0005-aaaaaaaaaaaa', 'Vintage Denim Jacket',              1.00, 'Classic fit denim with reinforced stitching and bronze buttons.',                            'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400',  'Clothing',    'POPULAR',   true),
  ('aaaaaaaa-0006-0006-0006-aaaaaaaaaaaa', 'Dark Cocoa Collection',             1.00, 'A set of 4 artisanal dark chocolate bars from South America.',                              'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400',  'Food',        null,        true),
  ('aaaaaaaa-0007-0007-0007-aaaaaaaaaaaa', 'Wireless Studio Headphones',        1.00, 'Premium sound with 30hr battery life and active noise cancellation.',                       'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',  'Electronics', 'POPULAR',   true),
  ('aaaaaaaa-0008-0008-0008-aaaaaaaaaaaa', 'Minimalist Watch',                  1.00, 'Swiss quartz movement with a sapphire crystal dial.',                                       'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',  'Accessories', null,        true),
  ('aaaaaaaa-0009-0009-0009-aaaaaaaaaaaa', 'Festoon Party Lights (25m)',        1.00, 'Weatherproof outdoor string lights, perfect for summer nights.',                            'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400',  'Home',        'POPULAR',   true),
  ('aaaaaaaa-0010-0010-0010-aaaaaaaaaaaa', 'Waterproof JBL Speaker',            1.00, 'Bass-heavy portable speaker with 12-hour battery life and IPX7 rating.',                    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',  'Electronics', null,        true),
  ('aaaaaaaa-0011-0011-0011-aaaaaaaaaaaa', 'Instax Mini 11 Bundle',             1.00, 'Capture memories instantly. Bundle includes 20 film sheets and a carry case.',              'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400',  'Electronics', 'LOW STOCK', true),
  ('aaaaaaaa-0012-0012-0012-aaaaaaaaaaaa', 'Wireless Noise-Canceling Headphones',1.00,'Industry-leading noise cancellation with Hi-Res Audio.',                                    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400',  'Electronics', null,        true);

-- ──────────────────────────────────────────────────────────────
-- 3.  COLLABORATIVE SHOP  ("Summer Party Planning")
-- ──────────────────────────────────────────────────────────────
insert into shops (id, name, created_by, cart_total, cart_goal) values
  ('bbbbbbbb-0001-0001-0001-bbbbbbbbbbbb', 'Summer Party Planning', '11111111-1111-1111-1111-111111111111', 325.00, 500.00);

insert into collaborators (shop_id, user_id, status) values
  ('bbbbbbbb-0001-0001-0001-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'active'),
  ('bbbbbbbb-0001-0001-0001-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'active'),
  ('bbbbbbbb-0001-0001-0001-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 'active'),
  ('bbbbbbbb-0001-0001-0001-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 'pending'),
  ('bbbbbbbb-0001-0001-0001-bbbbbbbbbbbb', '55555555-5555-5555-5555-555555555555', 'pending');

-- Shop products (3 items in the collab shop)
insert into shop_products (id, shop_id, product_id, added_by) values
  ('cccccccc-0001-0001-0001-cccccccccccc', 'bbbbbbbb-0001-0001-0001-bbbbbbbbbbbb', 'aaaaaaaa-0009-0009-0009-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111'),
  ('cccccccc-0002-0002-0002-cccccccccccc', 'bbbbbbbb-0001-0001-0001-bbbbbbbbbbbb', 'aaaaaaaa-0010-0010-0010-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333'),
  ('cccccccc-0003-0003-0003-cccccccccccc', 'bbbbbbbb-0001-0001-0001-bbbbbbbbbbbb', 'aaaaaaaa-0011-0011-0011-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111');

-- Votes
insert into product_votes (shop_product_id, user_id) values
  ('cccccccc-0001-0001-0001-cccccccccccc', '11111111-1111-1111-1111-111111111111'),
  ('cccccccc-0001-0001-0001-cccccccccccc', '22222222-2222-2222-2222-222222222222'),
  ('cccccccc-0002-0002-0002-cccccccccccc', '33333333-3333-3333-3333-333333333333'),
  ('cccccccc-0003-0003-0003-cccccccccccc', '11111111-1111-1111-1111-111111111111');

-- ──────────────────────────────────────────────────────────────
-- 4.  DEMO ORDERS  (4 orders matching mockOrders)
-- ──────────────────────────────────────────────────────────────
insert into orders (id, order_number, user_id, date, time, status, subtotal, shipping, tax, total, thumbnail) values
  ('dddddddd-0001-0001-0001-dddddddddddd', '88291', '11111111-1111-1111-1111-111111111111', 'Oct 24, 2023', '2:45 PM',  'COMPLETED',  1, 0, 0, 1.00, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200'),
  ('dddddddd-0002-0002-0002-dddddddddddd', '88240', '11111111-1111-1111-1111-111111111111', 'Oct 20, 2023', '11:12 AM', 'PROCESSING', 1, 0, 0, 1.00, 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=200'),
  ('dddddddd-0003-0003-0003-dddddddddddd', '88198', '11111111-1111-1111-1111-111111111111', 'Oct 18, 2023', '9:30 AM',  'COMPLETED',  1, 0, 0, 1.00, 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=200'),
  ('dddddddd-0004-0004-0004-dddddddddddd', '87922', '11111111-1111-1111-1111-111111111111', 'Oct 12, 2023', '3:20 PM',  'REFUNDED',   1, 0, 0, 1.00, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200');

-- Order items
insert into order_items (order_id, name, quantity, price, icon) values
  -- Order 88291
  ('dddddddd-0001-0001-0001-dddddddddddd', 'Wireless Noise-Canceling Headphones', 1, 1.00, 'headphones'),
  ('dddddddd-0001-0001-0001-dddddddddddd', 'USB-C Charging Cable (2m)',           2, 1.00, 'cable'),
  ('dddddddd-0001-0001-0001-dddddddddddd', 'Extended Warranty Plan (2 Years)',     1, 1.00, 'shield'),
  -- Order 88240
  ('dddddddd-0002-0002-0002-dddddddddddd', 'Premium Cotton T-Shirt',              2, 1.00, 'shirt'),
  -- Order 88198
  ('dddddddd-0003-0003-0003-dddddddddddd', 'Artisan Garden Salad',                3, 1.00, 'salad'),
  ('dddddddd-0003-0003-0003-dddddddddddd', 'Citrus Fusion Soda',                  4, 1.00, 'drink'),
  ('dddddddd-0003-0003-0003-dddddddddddd', 'Classic Craft Burger',                2, 1.00, 'burger'),
  -- Order 87922
  ('dddddddd-0004-0004-0004-dddddddddddd', 'Minimalist Watch',                    1, 1.00, 'watch'),
  ('dddddddd-0004-0004-0004-dddddddddddd', 'Vintage Denim Jacket',                1, 1.00, 'jacket');

-- ──────────────────────────────────────────────────────────────
-- 5.  DEMO PAYMENT (for the first completed order)
-- ──────────────────────────────────────────────────────────────
insert into payments (order_id, provider, amount, currency, status) values
  ('dddddddd-0001-0001-0001-dddddddddddd', 'mpesa', 1.00, 'KES', 'success'),
  ('dddddddd-0003-0003-0003-dddddddddddd', 'mpesa', 1.00, 'KES', 'success');
