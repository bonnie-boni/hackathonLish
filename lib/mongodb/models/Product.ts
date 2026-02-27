import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  badge?: 'NEW' | 'POPULAR' | 'LOW STOCK' | 'SALE';
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    category: { type: String, default: '' },
    badge: { type: String, enum: ['NEW', 'POPULAR', 'LOW STOCK', 'SALE', null], default: null },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
