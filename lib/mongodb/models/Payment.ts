import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPayment extends Document {
  orderId: mongoose.Types.ObjectId | string;
  provider: string;
  providerPaymentId?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  rawResponse?: any;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    orderId: { type: Schema.Types.Mixed, required: true },
    provider: { type: String, default: 'mpesa' },
    providerPaymentId: { type: String, default: null },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'KES' },
    status: { type: String, enum: ['pending', 'success', 'failed', 'cancelled'], default: 'pending' },
    rawResponse: { type: Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

export const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
