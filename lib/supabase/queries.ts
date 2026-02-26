import { createClient } from '@/lib/supabase/client';
import type { Product, User, Order, OrderItem, CollaborativeShop, Collaborator, CollabProduct } from '@/types';

// ── helpers ────────────────────────────────────────────────
// Lazy singleton – avoids crashing at module-eval time during SSR/build
let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!_supabase) _supabase = createClient();
  return _supabase;
}

// Map a Supabase product row → app Product
function toProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    description: row.description ?? '',
    image: row.image ?? '',
    category: row.category ?? '',
    badge: row.badge ?? undefined,
    inStock: row.in_stock ?? true,
  };
}

function toUser(row: any): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    initials: row.initials ?? '',
    avatar: row.avatar_url ?? undefined,
  };
}

// ── Products ───────────────────────────────────────────────
export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await getSupabase()
    .from('products')
    .select('*')
    .eq('in_stock', true)
    .order('created_at');

  if (error) {
    console.error('fetchProducts error', error);
    return [];
  }
  return (data ?? []).map(toProduct);
}

// ── Profiles / Users ───────────────────────────────────────
export async function fetchCurrentUser(): Promise<User | null> {
  const { data: { user } } = await getSupabase().auth.getUser();
  if (!user) return null;

  const { data } = await getSupabase()
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return data ? toUser(data) : null;
}

export async function fetchUsers(): Promise<User[]> {
  const { data } = await getSupabase().from('profiles').select('*');
  return (data ?? []).map(toUser);
}

// ── Orders + Items ─────────────────────────────────────────
export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await getSupabase()
    .from('orders')
    .select(`
      *,
      order_items(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('fetchOrders error', error);
    return [];
  }

  return (data ?? []).map((row: any): Order => ({
    id: row.id,
    orderNumber: row.order_number,
    date: row.date ?? '',
    time: row.time ?? '',
    status: row.status,
    subtotal: Number(row.subtotal),
    shipping: Number(row.shipping),
    tax: Number(row.tax),
    total: Number(row.total),
    thumbnail: row.thumbnail ?? '',
    items: (row.order_items ?? []).map((oi: any): OrderItem => ({
      id: oi.id,
      name: oi.name,
      quantity: oi.quantity,
      price: Number(oi.price),
      icon: oi.icon ?? 'default',
    })),
  }));
}

// ── Create Order ───────────────────────────────────────────
export async function createOrder(order: {
  orderNumber: string;
  userId?: string;
  items: { name: string; quantity: number; price: number; icon?: string }[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  thumbnail?: string;
}): Promise<string | null> {
  const { data, error } = await getSupabase()
    .from('orders')
    .insert({
      order_number: order.orderNumber,
      user_id: order.userId ?? null,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      status: 'PROCESSING',
      subtotal: order.subtotal,
      shipping: order.shipping,
      tax: order.tax,
      total: order.total,
      thumbnail: order.thumbnail ?? null,
    })
    .select('id')
    .single();

  if (error || !data) {
    console.error('createOrder error', error);
    return null;
  }

  // Insert order items
  const items = order.items.map((i) => ({
    order_id: data.id,
    name: i.name,
    quantity: i.quantity,
    price: i.price,
    icon: i.icon ?? null,
  }));

  const { error: itemsError } = await getSupabase().from('order_items').insert(items);
  if (itemsError) console.error('createOrder items error', itemsError);

  return data.id;
}

// ── Collaborative Shop ─────────────────────────────────────
export async function fetchCollaborativeShop(shopId: string): Promise<CollaborativeShop | null> {
  const { data: shop, error } = await getSupabase()
    .from('shops')
    .select(`
      *,
      creator:profiles!shops_created_by_fkey(*),
      collaborators(
        *,
        user:profiles(*)
      ),
      shop_products(
        *,
        product:products(*),
        added_by_user:profiles!shop_products_added_by_fkey(*),
        product_votes(
          *,
          voter:profiles(*)
        )
      )
    `)
    .eq('id', shopId)
    .single();

  if (error || !shop) {
    console.error('fetchCollaborativeShop error', error);
    return null;
  }

  const createdByUser = toUser(shop.creator);

  const collabs: Collaborator[] = (shop.collaborators ?? []).map((c: any) => ({
    user: toUser(c.user),
    status: c.status as 'active' | 'pending',
  }));

  const products: CollabProduct[] = (shop.shop_products ?? []).map((sp: any) => {
    const p = toProduct(sp.product);
    return {
      ...p,
      addedBy: sp.added_by_user ? toUser(sp.added_by_user) : createdByUser,
      votedBy: (sp.product_votes ?? []).map((v: any) => toUser(v.voter)),
    };
  });

  return {
    id: shop.id,
    name: shop.name,
    createdBy: createdByUser,
    lastActive: shop.last_active ? new Date(shop.last_active).toLocaleString() : 'just now',
    collaborators: collabs,
    products,
    cartTotal: Number(shop.cart_total),
    cartGoal: Number(shop.cart_goal),
  };
}

// ── M-Pesa transaction helpers (server-side, call from API routes) ──
export async function saveMpesaTransaction(tx: {
  orderId: string;
  checkoutRequestId: string;
  merchantRequestId: string;
  phoneNumber: string;
  amount: number;
}) {
  return getSupabase().from('mpesa_transactions').insert({
    order_id: tx.orderId,
    checkout_request_id: tx.checkoutRequestId,
    merchant_request_id: tx.merchantRequestId,
    phone_number: tx.phoneNumber,
    amount: tx.amount,
    status: 'pending',
  });
}

export async function updateMpesaTransaction(checkoutRequestId: string, update: {
  resultCode: number;
  resultDesc: string;
  mpesaReceiptNumber?: string;
  callbackPayload?: any;
}) {
  return getSupabase()
    .from('mpesa_transactions')
    .update({
      result_code: update.resultCode,
      result_desc: update.resultDesc,
      mpesa_receipt_number: update.mpesaReceiptNumber ?? null,
      callback_payload: update.callbackPayload ?? null,
      status: update.resultCode === 0 ? 'success' : 'failed',
    })
    .eq('checkout_request_id', checkoutRequestId);
}

// ── Payments ───────────────────────────────────────────────
export async function createPayment(payment: {
  orderId: string;
  amount: number;
  provider?: string;
}) {
  return getSupabase().from('payments').insert({
    order_id: payment.orderId,
    amount: payment.amount,
    provider: payment.provider ?? 'mpesa',
    status: 'pending',
  });
}

export async function updatePaymentStatus(orderId: string, status: 'success' | 'failed' | 'cancelled') {
  return getSupabase()
    .from('payments')
    .update({ status })
    .eq('order_id', orderId);
}

// ── Webhooks Log ───────────────────────────────────────────
export async function logWebhook(provider: string, eventType: string, payload: any) {
  return getSupabase().from('webhooks_log').insert({ provider, event_type: eventType, payload });
}

// ── Invites ────────────────────────────────────────────────
export async function createInvite(shopId: string, email: string, invitedBy: string) {
  return getSupabase().from('invites').insert({
    shop_id: shopId,
    email,
    invited_by: invitedBy,
    status: 'pending',
  });
}

