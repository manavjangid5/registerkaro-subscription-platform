import { z } from 'zod';
export declare const apiErrorResponseSchema: z.ZodObject<{
    error: z.ZodString;
    details: z.ZodOptional<z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
    error: string;
    details?: unknown;
}, {
    error: string;
    details?: unknown;
}>;
export declare const healthResponseSchema: z.ZodObject<{
    status: z.ZodLiteral<"ok">;
    timestamp: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "ok";
    timestamp: string;
}, {
    status: "ok";
    timestamp: string;
}>;
export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;
export type HealthResponse = z.infer<typeof healthResponseSchema>;
//# sourceMappingURL=api.d.ts.map