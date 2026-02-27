import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWebhookLog extends Document {
  provider: string;
  eventType: string;
  payload: any;
  createdAt: Date;
}

const WebhookLogSchema = new Schema<IWebhookLog>(
  {
    provider: { type: String, required: true },
    eventType: { type: String, required: true },
    payload: { type: Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

export const WebhookLog: Model<IWebhookLog> =
  mongoose.models.WebhookLog ||
  mongoose.model<IWebhookLog>('WebhookLog', WebhookLogSchema);
