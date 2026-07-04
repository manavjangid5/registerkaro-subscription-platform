import { z } from 'zod';
import {
  currencySchema,
  isoDateStringSchema,
  objectIdSchema,
  paiseSchema,
  paymentPurposeSchema,
  paymentStatusSchema,
} from './common.js';

export const paymentResponseSchema = z.object({
  id: objectIdSchema,
  subscriptionId: objectIdSchema,
  userId: objectIdSchema,
  amountInPaise: paiseSchema,
  currency: currencySchema,
  status: paymentStatusSchema,
  purpose: paymentPurposeSchema,
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string().nullable(),
  failureReason: z.string().nullable(),
  createdAt: isoDateStringSchema,
  updatedAt: isoDateStringSchema,
});

export const listPaymentsResponseSchema = z.object({
  payments: z.array(paymentResponseSchema),
});

export const verifyPaymentRequestSchema = z.object({
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});

export type PaymentResponse = z.infer<typeof paymentResponseSchema>;
export type ListPaymentsResponse = z.infer<typeof listPaymentsResponseSchema>;
export type VerifyPaymentRequest = z.infer<typeof verifyPaymentRequestSchema>;
