import { z } from 'zod';

export const apiErrorResponseSchema = z.object({
  error: z.string(),
  details: z.unknown().optional(),
});

export const healthResponseSchema = z.object({
  status: z.literal('ok'),
  timestamp: z.string(),
});

export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;
export type HealthResponse = z.infer<typeof healthResponseSchema>;
