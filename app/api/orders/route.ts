import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';

export async function GET() {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = createServiceClient();

  try {
    const body = await req.json();
    const { orderNumber, userId, items, subtotal, shipping, tax, total, thumbnail } = body;

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: userId ?? null,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        status: 'PROCESSING',
        subtotal,
        shipping,
        tax,
        total,
        thumbnail: thumbnail ?? null,
      })
      .select('id')
      .single();

    if (error || !order) {
      return NextResponse.json({ error: error?.message || 'Failed to create order' }, { status: 500 });
    }

    // Insert order items
    if (items && items.length > 0) {
      const orderItems = items.map((item: any) => ({
        order_id: order.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        icon: item.icon ?? null,
      }));

      await supabase.from('order_items').insert(orderItems);
    }

    return NextResponse.json({ id: order.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
