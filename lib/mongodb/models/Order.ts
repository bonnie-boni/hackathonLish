import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
  name: string;
  quantity: number;
  price: number;
  icon?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  userId?: mongoose.Types.ObjectId | string | null;
  userEmail?: string | null;
  date: string;
  time: string;
  status: 'COMPLETED' | 'PROCESSING' | 'REFUNDED' | 'CANCELLED';
  items: IOrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true },
    icon: { type: String, default: null },
  },
  { _id: true }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true },
    userId: { type: Schema.Types.Mixed, default: null },
    userEmail: { type: String, default: null },
    date: { type: String, default: '' },
    time: { type: String, default: '' },
    status: {
      type: String,
      enum: ['COMPLETED', 'PROCESSING', 'REFUNDED', 'CANCELLED'],
      default: 'PROCESSING',
    },
    items: [OrderItemSchema],
    subtotal: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    thumbnail: { type: String, default: null },
  },
  { timestamps: true }
);

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
