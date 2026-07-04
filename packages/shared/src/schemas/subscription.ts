import { z } from 'zod';
import {
  billingIntervalSchema,
  isoDateStringSchema,
  objectIdSchema,
  paiseSchema,
  planSnapshotSchema,
  subscriptionStatusSchema,
} from './common.js';

export const createSubscriptionRequestSchema = z.object({
  planId: objectIdSchema,
});

export const subscriptionIdParamSchema = z.object({
  subscriptionId: objectIdSchema,
});

export const upgradeSubscriptionRequestSchema = z.object({
  planId: objectIdSchema,
});

export const downgradeSubscriptionRequestSchema = z.object({
  planId: objectIdSchema,
});

export const subscriptionResponseSchema = z.object({
  id: objectIdSchema,
  userId: objectIdSchema,
  planSnapshot: planSnapshotSchema,
  status: subscriptionStatusSchema,
  currentPeriodStart: isoDateStringSchema,
  currentPeriodEnd: isoDateStringSchema,
  cancelAtPeriodEnd: z.boolean(),
  canceledAt: isoDateStringSchema.nullable(),
  scheduledPlanSnapshot: planSnapshotSchema.nullable(),
  createdAt: isoDateStringSchema,
  updatedAt: isoDateStringSchema,
});

export const listSubscriptionsResponseSchema = z.object({
  subscriptions: z.array(subscriptionResponseSchema),
});

export const checkoutSessionResponseSchema = z.object({
  subscriptionId: objectIdSchema,
  paymentId: objectIdSchema,
  razorpayOrderId: z.string(),
  amountInPaise: paiseSchema,
  currency: z.literal('INR'),
  razorpayKeyId: z.string(),
});

export type CreateSubscriptionRequest = z.infer<typeof createSubscriptionRequestSchema>;
export type UpgradeSubscriptionRequest = z.infer<typeof upgradeSubscriptionRequestSchema>;
export type DowngradeSubscriptionRequest = z.infer<typeof downgradeSubscriptionRequestSchema>;
export type SubscriptionResponse = z.infer<typeof subscriptionResponseSchema>;
export type ListSubscriptionsResponse = z.infer<typeof listSubscriptionsResponseSchema>;
export type CheckoutSessionResponse = z.infer<typeof checkoutSessionResponseSchema>;
