import { z } from 'zod';
export const apiErrorResponseSchema = z.object({
    error: z.string(),
    details: z.unknown().optional(),
});
export const healthResponseSchema = z.object({
    status: z.literal('ok'),
    timestamp: z.string(),
});
//# sourceMappingURL=api.js.map