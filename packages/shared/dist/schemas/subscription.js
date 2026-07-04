import { z } from 'zod';
import { isoDateStringSchema, objectIdSchema, paiseSchema, planSnapshotSchema, subscriptionStatusSchema, } from './common.js';
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
//# sourceMappingURL=subscription.js.map