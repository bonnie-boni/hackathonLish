import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb/connection';
import { Order as OrderModel } from '@/lib/mongodb/models/Order';

export async function GET() {
  try {
    await connectDB();
    const orders = await OrderModel.find().sort({ createdAt: -1 }).lean();

    const mapped = orders.map((row: any) => ({
      id: row._id.toString(),
      order_number: row.orderNumber,
      date: row.date,
      time: row.time,
      status: row.status,
      subtotal: row.subtotal,
      shipping: row.shipping,
      tax: row.tax,
      total: row.total,
      thumbnail: row.thumbnail,
      user_id: row.userId,
      order_items: (row.items ?? []).map((i: any) => ({
        id: i._id?.toString() ?? '',
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        icon: i.icon,
      })),
    }));

    return NextResponse.json(mapped);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { orderNumber, userId, userEmail, items, subtotal, shipping, tax, total, thumbnail } = body;

    // Try to resolve user by email if userId not provided
    let resolvedUserId: string | null = userId ?? null;
    if (!resolvedUserId && userEmail) {
      const { Profile } = await import('@/lib/mongodb/models/Profile');
      const profile = await Profile.findOne({ email: userEmail }).lean();
      resolvedUserId = profile ? (profile._id as any).toString() : null;
    }

    const order = await OrderModel.create({
      orderNumber,
      userId: resolvedUserId,
      userEmail: userEmail ?? null,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      status: 'PROCESSING',
      items: (items ?? []).map((item: any) => {
        // Support both flat { name, price } and nested CartItem { product: { name, price }, quantity }
        const prod = item.product ?? item;
        return {
          name: prod.name,
          quantity: item.quantity ?? 1,
          price: Number(prod.price),
          icon: prod.icon ?? prod.image ?? null,
        };
      }),
      subtotal,
      shipping,
      tax,
      total,
      thumbnail: thumbnail ?? null,
    });

    return NextResponse.json({ id: order._id.toString() });
  } catch (err: any) {
    console.error('Order insert error:', err);
    return NextResponse.json({ error: err.message || 'Failed to create order' }, { status: 500 });
  }
}
