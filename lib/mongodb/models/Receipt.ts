import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReceipt extends Document {
  orderId: mongoose.Types.ObjectId | string;
  paymentId?: mongoose.Types.ObjectId | string | null;
  mpesaTxId?: mongoose.Types.ObjectId | string | null;
  receiptNumber?: string;
  amount: number;
  currency: string;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

const ReceiptSchema = new Schema<IReceipt>(
  {
    orderId: { type: Schema.Types.Mixed, required: true },
    paymentId: { type: Schema.Types.Mixed, default: null },
    mpesaTxId: { type: Schema.Types.Mixed, default: null },
    receiptNumber: { type: String, default: null },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'KES' },
    metadata: { type: Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

export const Receipt: Model<IReceipt> =
  mongoose.models.Receipt || mongoose.model<IReceipt>('Receipt', ReceiptSchema);
