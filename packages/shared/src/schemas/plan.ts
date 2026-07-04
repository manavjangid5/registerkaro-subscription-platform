import { z } from 'zod';
import {
  billingIntervalSchema,
  currencySchema,
  objectIdSchema,
  paiseSchema,
} from './common.js';

export const planResponseSchema = z.object({
  id: objectIdSchema,
  planGroup: z.string(),
  name: z.string(),
  description: z.string(),
  billingInterval: billingIntervalSchema,
  priceInPaise: paiseSchema,
  currency: currencySchema,
  features: z.array(z.string()),
  sortOrder: z.number().int(),
});

export const listPlansResponseSchema = z.object({
  plans: z.array(planResponseSchema),
});

export const planGroupParamSchema = z.object({
  planGroup: z.string().min(1).max(64),
});

export const planIdParamSchema = z.object({
  planId: objectIdSchema,
});

export type PlanResponse = z.infer<typeof planResponseSchema>;
export type ListPlansResponse = z.infer<typeof listPlansResponseSchema>;
