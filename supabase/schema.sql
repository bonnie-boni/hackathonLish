-- ============================================================
-- ModernShop – Supabase Postgres Schema
-- Run this in the Supabase SQL Editor (or via migrations).
-- ============================================================

-- 0. Extensions
create extension if not exists "pgcrypto";

-- ============================================================
-- 1. ENUMS
-- ============================================================
create type product_badge  as enum ('NEW', 'POPULAR', 'LOW STOCK', 'SALE');
create type order_status   as enum ('COMPLETED', 'PROCESSING', 'REFUNDED', 'CANCELLED');
create type payment_status as enum ('pending', 'success', 'failed', 'cancelled');
create type collaborator_status as enum ('active', 'pending');
create type invite_status  as enum ('pending', 'accepted', 'expired');

-- ============================================================
-- 2. PROFILES  (linked to Supabase Auth)
-- ============================================================
create table profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text not null,
  email      text unique not null,
  initials   text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- 3. PRODUCTS
-- ============================================================
create table products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  price       numeric(12,2) not null default 1.00,
  description text,
  image       text,
  category    text,
  badge       product_badge,
  in_stock    boolean default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index products_category_idx on products (category);
create index products_name_idx     on products using gin (to_tsvector('english', name));

-- ============================================================
-- 4. COLLABORATIVE SHOPS
-- ============================================================
create table shops (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  created_by  uuid references profiles(id) on delete set null,
  last_active timestamptz default now(),
  cart_total  numeric(12,2) default 0,
  cart_goal   numeric(12,2) default 500,
  created_at  timestamptz default now()
);

-- ============================================================
-- 5. SHOP COLLABORATORS
-- ============================================================
create table collaborators (
  id        uuid primary key default gen_random_uuid(),
  shop_id   uuid not null references shops(id) on delete cascade,
  user_id   uuid not null references profiles(id) on delete cascade,
  status    collaborator_status default 'pending',
  joined_at timestamptz default now(),
  unique(shop_id, user_id)
);

create index collaborators_shop_idx on collaborators (shop_id);
create index collaborators_user_idx on collaborators (user_id);

-- ============================================================
-- 6. COLLABORATIVE SHOP PRODUCTS  (products added to a shop)
-- ============================================================
create table shop_products (
  id          uuid primary key default gen_random_uuid(),
  shop_id     uuid not null references shops(id) on delete cascade,
  product_id  uuid not null references products(id) on delete cascade,
  added_by    uuid references profiles(id) on delete set null,
  created_at  timestamptz default now(),
  unique(shop_id, product_id)
);

-- ============================================================
-- 7. PRODUCT VOTES (who voted for a product in a shop)
-- ============================================================
create table product_votes (
  id          uuid primary key default gen_random_uuid(),
  shop_product_id uuid not null references shop_products(id) on delete cascade,
  user_id     uuid not null references profiles(id) on delete cascade,
  created_at  timestamptz default now(),
  unique(shop_product_id, user_id)
);

-- ============================================================
-- 8. INVITES  (email-based invitations)
-- ============================================================
create table invites (
  id         uuid primary key default gen_random_uuid(),
  shop_id    uuid not null references shops(id) on delete cascade,
  email      text not null,
  invited_by uuid references profiles(id),
  status     invite_status default 'pending',
  token      text unique default encode(gen_random_bytes(24), 'hex'),
  created_at timestamptz default now(),
  accepted_at timestamptz
);

-- ============================================================
-- 9. CARTS  (server-side cart, optional – the app also has a Zustand local cart)
-- ============================================================
create table carts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table cart_items (
  id         uuid primary key default gen_random_uuid(),
  cart_id    uuid not null references carts(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  quantity   int not null check (quantity > 0) default 1,
  created_at timestamptz default now()
);

create index cart_items_cart_idx on cart_items (cart_id);

-- ============================================================
-- 10. ORDERS
-- ============================================================
create table orders (
  id            uuid primary key default gen_random_uuid(),
  order_number  text unique not null,
  user_id       uuid references profiles(id) on delete set null,
  date          text, -- display date e.g. 'Oct 24, 2023'
  time          text, -- display time e.g. '2:45 PM'
  status        order_status default 'PROCESSING',
  subtotal      numeric(12,2) not null default 0,
  shipping      numeric(12,2) not null default 0,
  tax           numeric(12,2) not null default 0,
  total         numeric(12,2) not null default 0,
  thumbnail     text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index orders_user_idx   on orders (user_id);
create index orders_status_idx on orders (status);

-- ============================================================
-- 11. ORDER ITEMS
-- ============================================================
create table order_items (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references orders(id) on delete cascade,
  name       text not null,
  quantity   int not null default 1,
  price      numeric(12,2) not null default 0,
  icon       text -- e.g. 'headphones', 'cable', 'shield'
);

create index order_items_order_idx on order_items (order_id);

-- ============================================================
-- 12. PAYMENTS  (generic – can be M-Pesa or other)
-- ============================================================
create table payments (
  id                  uuid primary key default gen_random_uuid(),
  order_id            uuid references orders(id) on delete set null,
  provider            text not null default 'mpesa',
  provider_payment_id text,
  amount              numeric(12,2) not null,
  currency            text default 'KES',
  status              payment_status default 'pending',
  raw_response        jsonb,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

create index payments_order_idx on payments (order_id);

-- ============================================================
-- 13. M-PESA TRANSACTIONS  (STK push callbacks)
-- ============================================================
create table mpesa_transactions (
  id                    uuid primary key default gen_random_uuid(),
  order_id              uuid references orders(id) on delete set null,
  checkout_request_id   text,
  merchant_request_id   text,
  phone_number          text,
  amount                numeric(12,2),
  result_code           int,
  result_desc           text,
  mpesa_receipt_number  text,
  callback_payload      jsonb,
  status                payment_status default 'pending',
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

create index mpesa_checkout_idx on mpesa_transactions (checkout_request_id);
create index mpesa_order_idx    on mpesa_transactions (order_id);

-- ============================================================
-- 14. WEBHOOKS LOG  (audit trail)
-- ============================================================
create table webhooks_log (
  id          bigserial primary key,
  provider    text,
  event_type  text,
  payload     jsonb,
  received_at timestamptz default now()
);

-- ============================================================
-- 15. UPDATED_AT TRIGGER
-- ============================================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_profiles_updated   before update on profiles           for each row execute function set_updated_at();
create trigger trg_products_updated    before update on products           for each row execute function set_updated_at();
create trigger trg_orders_updated      before update on orders             for each row execute function set_updated_at();
create trigger trg_payments_updated    before update on payments           for each row execute function set_updated_at();
create trigger trg_mpesa_tx_updated    before update on mpesa_transactions for each row execute function set_updated_at();
create trigger trg_carts_updated       before update on carts              for each row execute function set_updated_at();

-- ============================================================
-- 16. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Profiles: users can read all profiles, only update own
alter table profiles enable row level security;
create policy "Profiles are viewable by everyone"  on profiles for select using (true);
create policy "Users can update own profile"       on profiles for update using (auth.uid() = id);

-- Products: readable by all, writable by authenticated
alter table products enable row level security;
create policy "Products are viewable by everyone"  on products for select using (true);
create policy "Authenticated can insert products"  on products for insert with check (auth.role() = 'authenticated');

-- Orders: users see own orders
alter table orders enable row level security;
create policy "Users can view own orders"  on orders for select using (auth.uid() = user_id);
create policy "Users can insert own orders" on orders for insert with check (auth.uid() = user_id);
create policy "Users can update own orders" on orders for update using (auth.uid() = user_id);

-- Order items: follow the order policy
alter table order_items enable row level security;
create policy "Users can view own order items" on order_items for select
  using (exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid()));
create policy "Users can insert own order items" on order_items for insert
  with check (exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid()));

-- Shops: viewable if user is a collaborator
alter table shops enable row level security;
create policy "Shop members can view shops" on shops for select
  using (
    created_by = auth.uid()
    or exists (select 1 from collaborators where collaborators.shop_id = shops.id and collaborators.user_id = auth.uid())
  );
create policy "Authenticated can create shops" on shops for insert with check (auth.uid() = created_by);

-- Collaborators
alter table collaborators enable row level security;
create policy "Shop members can view collaborators" on collaborators for select
  using (exists (select 1 from collaborators c2 where c2.shop_id = collaborators.shop_id and c2.user_id = auth.uid()));
create policy "Shop owner can insert collaborators" on collaborators for insert
  with check (exists (select 1 from shops where shops.id = collaborators.shop_id and shops.created_by = auth.uid()));

-- Payments: viewable via order ownership
alter table payments enable row level security;
create policy "Users can view own payments" on payments for select
  using (exists (select 1 from orders where orders.id = payments.order_id and orders.user_id = auth.uid()));

-- Mpesa transactions
alter table mpesa_transactions enable row level security;
create policy "Users can view own mpesa tx" on mpesa_transactions for select
  using (exists (select 1 from orders where orders.id = mpesa_transactions.order_id and orders.user_id = auth.uid()));

-- Cart
alter table carts enable row level security;
create policy "Users can manage own cart" on carts for all using (auth.uid() = user_id);
alter table cart_items enable row level security;
create policy "Users can manage own cart items" on cart_items for all
  using (exists (select 1 from carts where carts.id = cart_items.cart_id and carts.user_id = auth.uid()));

-- Shop products
alter table shop_products enable row level security;
create policy "Shop members can view shop products" on shop_products for select
  using (exists (select 1 from collaborators where collaborators.shop_id = shop_products.shop_id and collaborators.user_id = auth.uid()));

-- Product votes
alter table product_votes enable row level security;
create policy "Shop members can view votes" on product_votes for select
  using (exists (
    select 1 from shop_products sp
    join collaborators c on c.shop_id = sp.shop_id
    where sp.id = product_votes.shop_product_id and c.user_id = auth.uid()
  ));

-- Invites: viewable by inviter
alter table invites enable row level security;
create policy "Inviters can view invites" on invites for select using (invited_by = auth.uid());
create policy "Authenticated can create invites" on invites for insert with check (auth.uid() = invited_by);
