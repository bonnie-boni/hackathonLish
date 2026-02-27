import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInvite extends Document {
  shopId: string;
  email: string;
  invitedBy?: string | null;
  status: 'pending' | 'accepted' | 'expired';
  token: string;
  acceptedAt?: Date | null;
  createdAt: Date;
}

const InviteSchema = new Schema<IInvite>(
  {
    shopId: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    invitedBy: { type: String, default: null },
    status: { type: String, enum: ['pending', 'accepted', 'expired'], default: 'pending' },
    token: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    acceptedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Invite: Model<IInvite> =
  mongoose.models.Invite || mongoose.model<IInvite>('Invite', InviteSchema);
