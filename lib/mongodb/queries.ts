import { connectDB } from '@/lib/mongodb/connection';
import { Product as ProductModel } from '@/lib/mongodb/models/Product';
import { Profile as ProfileModel } from '@/lib/mongodb/models/Profile';
import { Order as OrderModel } from '@/lib/mongodb/models/Order';
import type { Product, User, Order, OrderItem } from '@/types';

// ── Products ───────────────────────────────────────────────
export async function fetchProducts(): Promise<Product[]> {
  try {
    await connectDB();
    const docs = await ProductModel.find({ inStock: true }).sort({ createdAt: 1 }).lean();
    return docs.map((d: any) => ({
      id: d._id.toString(),
      name: d.name,
      price: Number(d.price),
      description: d.description ?? '',
      image: d.image ?? '',
      category: d.category ?? '',
      badge: d.badge ?? undefined,
      inStock: d.inStock ?? true,
    }));
  } catch (err) {
    console.error('fetchProducts error', err);
    return [];
  }
}

// ── Users / Profiles ───────────────────────────────────────
export async function fetchCurrentUser(): Promise<User | null> {
  // With MongoDB we don't have Supabase auth sessions.
  // The client uses mock / local auth. Return null here.
  return null;
}

export async function fetchUsers(): Promise<User[]> {
  try {
    await connectDB();
    const docs = await ProfileModel.find().lean();
    return docs.map((d: any) => ({
      id: d._id.toString(),
      name: d.name,
      email: d.email,
      initials: d.initials ?? '',
      avatar: d.avatarUrl ?? undefined,
    }));
  } catch (err) {
    console.error('fetchUsers error', err);
    return [];
  }
}

// ── Orders ─────────────────────────────────────────────────
export async function fetchOrders(): Promise<Order[]> {
  try {
    await connectDB();
    const docs = await OrderModel.find().sort({ createdAt: -1 }).lean();
    return docs.map((row: any): Order => ({
      id: row._id.toString(),
      orderNumber: row.orderNumber,
      date: row.date ?? '',
      time: row.time ?? '',
      status: row.status,
      subtotal: Number(row.subtotal),
      shipping: Number(row.shipping),
      tax: Number(row.tax),
      total: Number(row.total),
      thumbnail: row.thumbnail ?? '',
      items: (row.items ?? []).map((oi: any): OrderItem => ({
        id: oi._id?.toString() ?? '',
        name: oi.name,
        quantity: oi.quantity,
        price: Number(oi.price),
        icon: oi.icon ?? 'default',
      })),
    }));
  } catch (err) {
    console.error('fetchOrders error', err);
    return [];
  }
}

// ── Create Order ───────────────────────────────────────────
export async function createOrder(order: {
  orderNumber: string;
  userId?: string;
  items: { name: string; quantity: number; price: number; icon?: string | null }[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  thumbnail?: string | null;
}): Promise<string | null> {
  try {
    await connectDB();
    const doc: any = await OrderModel.create({
      orderNumber: order.orderNumber,
      userId: order.userId ?? null,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      status: 'PROCESSING',
      items: order.items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        icon: i.icon || undefined,
      })),
      subtotal: order.subtotal,
      shipping: order.shipping,
      tax: order.tax,
      total: order.total,
      thumbnail: order.thumbnail || undefined,
    });
    return doc._id.toString();
  } catch (err) {
    console.error('createOrder error', err);
    return null;
  }
}
