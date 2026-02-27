import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMpesaTransaction extends Document {
  orderId?: mongoose.Types.ObjectId | string | null;
  checkoutRequestId: string;
  merchantRequestId?: string;
  phoneNumber: string;
  amount: number;
  status: 'pending' | 'success' | 'failed';
  resultCode?: number;
  resultDesc?: string;
  mpesaReceiptNumber?: string;
  callbackPayload?: any;
  createdAt: Date;
  updatedAt: Date;
}

const MpesaTransactionSchema = new Schema<IMpesaTransaction>(
  {
    orderId: { type: Schema.Types.Mixed, default: null },
    checkoutRequestId: { type: String, required: true },
    merchantRequestId: { type: String, default: null },
    phoneNumber: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
    resultCode: { type: Number, default: null },
    resultDesc: { type: String, default: null },
    mpesaReceiptNumber: { type: String, default: null },
    callbackPayload: { type: Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

export const MpesaTransaction: Model<IMpesaTransaction> =
  mongoose.models.MpesaTransaction ||
  mongoose.model<IMpesaTransaction>('MpesaTransaction', MpesaTransactionSchema);
