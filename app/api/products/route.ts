import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb/connection';
import { Product as ProductModel } from '@/lib/mongodb/models/Product';

export async function GET() {
  try {
    await connectDB();
    const docs = await ProductModel.find({ inStock: true }).sort({ createdAt: 1 }).lean();

    const products = docs.map((d: any) => ({
      id: d._id.toString(),
      name: d.name,
      price: Number(d.price),
      description: d.description ?? '',
      image: d.image ?? '',
      category: d.category ?? '',
      badge: d.badge ?? undefined,
      inStock: d.inStock ?? true,
    }));

    return NextResponse.json(products);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
