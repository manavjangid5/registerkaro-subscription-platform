import { z } from 'zod';
import {
  BILLING_INTERVALS,
  CURRENCY,
  INVOICE_STATUSES,
  NOTIFICATION_CHANNELS,
  NOTIFICATION_STATUSES,
  NOTIFICATION_TYPES,
  PAYMENT_PURPOSES,
  PAYMENT_STATUSES,
  SUBSCRIPTION_STATUSES,
  WEBHOOK_EVENT_STATUSES,
} from '../types/entities.js';

/** Integer paise only — rejects floats at validation boundary. */
export const paiseSchema = z
  .number({
    required_error: 'Amount is required',
    invalid_type_error: 'Amount must be a number',
  })
  .int('Amount must be integer paise')
  .min(1, 'Amount must be at least 1 paise');

export const emailSchema = z
  .string()
  .trim()
  .email('Invalid email address')
  .transform((value) => value.toLowerCase());

export const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, 'Invalid identifier');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters');

export const billingIntervalSchema = z.enum(BILLING_INTERVALS);

export const subscriptionStatusSchema = z.enum(SUBSCRIPTION_STATUSES);

export const paymentStatusSchema = z.enum(PAYMENT_STATUSES);

export const paymentPurposeSchema = z.enum(PAYMENT_PURPOSES);

export const invoiceStatusSchema = z.enum(INVOICE_STATUSES);

export const webhookEventStatusSchema = z.enum(WEBHOOK_EVENT_STATUSES);

export const notificationTypeSchema = z.enum(NOTIFICATION_TYPES);

export const notificationChannelSchema = z.enum(NOTIFICATION_CHANNELS);

export const notificationStatusSchema = z.enum(NOTIFICATION_STATUSES);

export const currencySchema = z.literal(CURRENCY);

export const planSnapshotSchema = z.object({
  planId: objectIdSchema,
  planGroup: z.string().min(1).max(64),
  name: z.string().min(1).max(128),
  billingInterval: billingIntervalSchema,
  priceInPaise: paiseSchema,
});

export const isoDateStringSchema = z.string().datetime({ offset: true });

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
