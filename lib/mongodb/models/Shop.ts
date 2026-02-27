import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IShop extends Document {
  name: string;
  createdBy?: mongoose.Types.ObjectId | string | null;
  lastActive: Date;
  cartTotal: number;
  cartGoal: number;
  createdAt: Date;
}

const ShopSchema = new Schema<IShop>(
  {
    name: { type: String, required: true },
    createdBy: { type: Schema.Types.Mixed, default: null },
    lastActive: { type: Date, default: Date.now },
    cartTotal: { type: Number, default: 0 },
    cartGoal: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Shop: Model<IShop> =
  mongoose.models.Shop || mongoose.model<IShop>('Shop', ShopSchema);
