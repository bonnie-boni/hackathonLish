import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICollaborator extends Document {
  shopId: string;
  userId: string;
  status: 'active' | 'pending';
  joinedAt: Date;
}

const CollaboratorSchema = new Schema<ICollaborator>(
  {
    shopId: { type: String, required: true },
    userId: { type: String, required: true },
    status: { type: String, enum: ['active', 'pending'], default: 'pending' },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Collaborator: Model<ICollaborator> =
  mongoose.models.Collaborator ||
  mongoose.model<ICollaborator>('Collaborator', CollaboratorSchema);
