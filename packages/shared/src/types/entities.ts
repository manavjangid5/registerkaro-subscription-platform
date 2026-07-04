export const BILLING_INTERVALS = ['MONTHLY', 'YEARLY'] as const;
export type BillingInterval = (typeof BILLING_INTERVALS)[number];

export const SUBSCRIPTION_STATUSES = [
  'pending',
  'active',
  'past_due',
  'canceled',
  'expired',
] as const;
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];

export const PAYMENT_STATUSES = [
  'created',
  'pending',
  'authorized',
  'captured',
  'failed',
  'refunded',
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const PAYMENT_PURPOSES = [
  'initial',
  'renewal',
  'upgrade_proration',
  'refund_reversal',
] as const;
export type PaymentPurpose = (typeof PAYMENT_PURPOSES)[number];

export const INVOICE_STATUSES = ['issued', 'paid', 'void'] as const;
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

export const WEBHOOK_EVENT_STATUSES = ['received', 'processing', 'processed', 'failed'] as const;
export type WebhookEventStatus = (typeof WEBHOOK_EVENT_STATUSES)[number];

export const NOTIFICATION_TYPES = [
  'subscription_activated',
  'payment_failed',
  'subscription_canceled',
  'invoice_issued',
  'payment_refunded',
] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export const NOTIFICATION_CHANNELS = ['email'] as const;
export type NotificationChannel = (typeof NOTIFICATION_CHANNELS)[number];

export const NOTIFICATION_STATUSES = ['pending', 'sent', 'failed'] as const;
export type NotificationStatus = (typeof NOTIFICATION_STATUSES)[number];

export const CURRENCY = 'INR' as const;
export type Currency = typeof CURRENCY;

export interface PlanSnapshot {
  planId: string;
  planGroup: string;
  name: string;
  billingInterval: BillingInterval;
  priceInPaise: number;
}

export interface User {
  _id: string;
  email: string;
  passwordHash: string;
  name: string;
  razorpayCustomerId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Plan {
  _id: string;
  planGroup: string;
  name: string;
  description: string;
  billingInterval: BillingInterval;
  priceInPaise: number;
  currency: Currency;
  features: string[];
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  _id: string;
  userId: string;
  planSnapshot: PlanSnapshot;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt: string | null;
  scheduledPlanSnapshot: PlanSnapshot | null;
  razorpaySubscriptionId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  _id: string;
  subscriptionId: string;
  userId: string;
  amountInPaise: number;
  currency: Currency;
  status: PaymentStatus;
  purpose: PaymentPurpose;
  razorpayOrderId: string;
  razorpayPaymentId: string | null;
  invoiceId: string | null;
  webhookEventId: string | null;
  failureReason: string | null;
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  _id: string;
  subscriptionId: string;
  userId: string;
  paymentId: string;
  planSnapshot: PlanSnapshot;
  amountInPaise: number;
  currency: Currency;
  periodStart: string;
  periodEnd: string;
  status: InvoiceStatus;
  invoiceNumber: string;
  issuedAt: string;
  paidAt: string | null;
  createdAt: string;
}

export interface WebhookEvent {
  _id: string;
  gatewayEventId: string;
  eventType: string;
  entityType: string;
  entityId: string;
  payload: Record<string, unknown>;
  status: WebhookEventStatus;
  processedAt: string | null;
  error: string | null;
  createdAt: string;
}

export interface NotificationLog {
  _id: string;
  userId: string;
  subscriptionId: string | null;
  type: NotificationType;
  channel: NotificationChannel;
  recipient: string;
  status: NotificationStatus;
  idempotencyKey: string;
  resendMessageId: string | null;
  payload: Record<string, unknown>;
  createdAt: string;
  sentAt: string | null;
}
