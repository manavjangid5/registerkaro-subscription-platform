import {
  BILLING_INTERVALS,
  CURRENCY,
  type BillingInterval,
  type Currency,
} from '@registerkaro/shared';
import { Schema, model, type InferSchemaType, type Types } from 'mongoose';

const planSnapshotSubSchema = new Schema(
  {
    planId: { type: Schema.Types.ObjectId, required: true, ref: 'Plan' },
    planGroup: { type: String, required: true },
    name: { type: String, required: true },
    billingInterval: { type: String, enum: BILLING_INTERVALS, required: true },
    priceInPaise: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const userSchema = new Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    razorpayCustomerId: { type: String, default: null },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 }, { unique: true });

export type UserDocument = InferSchemaType<typeof userSchema> & {
  _id: Types.ObjectId;
};

export const User = model('User', userSchema);

const planSchema = new Schema(
  {
    planGroup: { type: String, required: true, trim: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    billingInterval: { type: String, enum: BILLING_INTERVALS, required: true },
    priceInPaise: { type: Number, required: true, min: 1 },
    currency: { type: String, enum: [CURRENCY], default: CURRENCY satisfies Currency },
    features: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

planSchema.index({ planGroup: 1 });
planSchema.index(
  { planGroup: 1, billingInterval: 1 },
  {
    unique: true,
    partialFilterExpression: { isActive: true },
  },
);

export type PlanDocument = InferSchemaType<typeof planSchema> & {
  _id: Types.ObjectId;
  billingInterval: BillingInterval;
  currency: Currency;
};

export const Plan = model('Plan', planSchema);

const subscriptionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User', index: true },
    planSnapshot: { type: planSnapshotSubSchema, required: true },
    status: {
      type: String,
      enum: ['pending', 'active', 'past_due', 'canceled', 'expired'],
      required: true,
    },
    currentPeriodStart: { type: Date, required: true },
    currentPeriodEnd: { type: Date, required: true },
    cancelAtPeriodEnd: { type: Boolean, default: false },
    canceledAt: { type: Date, default: null },
    scheduledPlanSnapshot: { type: planSnapshotSubSchema, default: null },
    razorpaySubscriptionId: { type: String, default: null },
  },
  { timestamps: true },
);

subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ currentPeriodEnd: 1 });

export type SubscriptionDocument = InferSchemaType<typeof subscriptionSchema> & {
  _id: Types.ObjectId;
};

export const Subscription = model('Subscription', subscriptionSchema);

const paymentSchema = new Schema(
  {
    subscriptionId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Subscription',
      index: true,
    },
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User', index: true },
    amountInPaise: { type: Number, required: true, min: 1 },
    currency: { type: String, enum: [CURRENCY], default: CURRENCY satisfies Currency },
    status: {
      type: String,
      enum: ['created', 'pending', 'authorized', 'captured', 'failed', 'refunded'],
      required: true,
    },
    purpose: {
      type: String,
      enum: ['initial', 'renewal', 'upgrade_proration', 'refund_reversal'],
      required: true,
    },
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String, default: null },
    invoiceId: { type: Schema.Types.ObjectId, default: null, ref: 'Invoice' },
    webhookEventId: { type: Schema.Types.ObjectId, default: null, ref: 'WebhookEvent' },
    failureReason: { type: String, default: null },
    idempotencyKey: { type: String, required: true },
  },
  { timestamps: true },
);

paymentSchema.index({ razorpayOrderId: 1 }, { unique: true });
paymentSchema.index({ idempotencyKey: 1 }, { unique: true });
paymentSchema.index({ subscriptionId: 1, status: 1 });

export type PaymentDocument = InferSchemaType<typeof paymentSchema> & {
  _id: Types.ObjectId;
};

export const Payment = model('Payment', paymentSchema);

const invoiceSchema = new Schema(
  {
    subscriptionId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Subscription',
      index: true,
    },
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User', index: true },
    paymentId: { type: Schema.Types.ObjectId, required: true, ref: 'Payment' },
    planSnapshot: { type: planSnapshotSubSchema, required: true },
    amountInPaise: { type: Number, required: true, min: 1 },
    currency: { type: String, enum: [CURRENCY], default: CURRENCY satisfies Currency },
    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },
    status: { type: String, enum: ['issued', 'paid', 'void'], required: true },
    invoiceNumber: { type: String, required: true },
    issuedAt: { type: Date, required: true },
    paidAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

invoiceSchema.index({ subscriptionId: 1, periodStart: 1, periodEnd: 1 }, { unique: true });
invoiceSchema.index({ invoiceNumber: 1 }, { unique: true });

export type InvoiceDocument = InferSchemaType<typeof invoiceSchema> & {
  _id: Types.ObjectId;
};

export const Invoice = model('Invoice', invoiceSchema);

const webhookEventSchema = new Schema(
  {
    gatewayEventId: { type: String, required: true },
    eventType: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: String, required: true },
    payload: { type: Schema.Types.Mixed, required: true },
    status: {
      type: String,
      enum: ['received', 'processing', 'processed', 'failed'],
      required: true,
    },
    processedAt: { type: Date, default: null },
    error: { type: String, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

webhookEventSchema.index({ gatewayEventId: 1 }, { unique: true });
webhookEventSchema.index({ entityId: 1, eventType: 1 });

export type WebhookEventDocument = InferSchemaType<typeof webhookEventSchema> & {
  _id: Types.ObjectId;
};

export const WebhookEvent = model('WebhookEvent', webhookEventSchema);

const notificationLogSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User', index: true },
    subscriptionId: { type: Schema.Types.ObjectId, default: null, ref: 'Subscription' },
    type: {
      type: String,
      enum: [
        'subscription_activated',
        'payment_failed',
        'subscription_canceled',
        'invoice_issued',
        'payment_refunded',
      ],
      required: true,
    },
    channel: { type: String, enum: ['email'], required: true },
    recipient: { type: String, required: true },
    status: { type: String, enum: ['pending', 'sent', 'failed'], required: true },
    idempotencyKey: { type: String, required: true },
    resendMessageId: { type: String, default: null },
    payload: { type: Schema.Types.Mixed, default: {} },
    sentAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

notificationLogSchema.index({ idempotencyKey: 1 }, { unique: true });

export type NotificationLogDocument = InferSchemaType<typeof notificationLogSchema> & {
  _id: Types.ObjectId;
};

export const NotificationLog = model('NotificationLog', notificationLogSchema);

export { planSnapshotSubSchema };
