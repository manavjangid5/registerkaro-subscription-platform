import { z } from 'zod';
/** Integer paise only — rejects floats at validation boundary. */
export declare const paiseSchema: z.ZodNumber;
export declare const emailSchema: z.ZodEffects<z.ZodString, string, string>;
export declare const objectIdSchema: z.ZodString;
export declare const passwordSchema: z.ZodString;
export declare const billingIntervalSchema: z.ZodEnum<["MONTHLY", "YEARLY"]>;
export declare const subscriptionStatusSchema: z.ZodEnum<["pending", "active", "past_due", "canceled", "expired"]>;
export declare const paymentStatusSchema: z.ZodEnum<["created", "pending", "authorized", "captured", "failed", "refunded"]>;
export declare const paymentPurposeSchema: z.ZodEnum<["initial", "renewal", "upgrade_proration", "refund_reversal"]>;
export declare const invoiceStatusSchema: z.ZodEnum<["issued", "paid", "void"]>;
export declare const webhookEventStatusSchema: z.ZodEnum<["received", "processing", "processed", "failed"]>;
export declare const notificationTypeSchema: z.ZodEnum<["subscription_activated", "payment_failed", "subscription_canceled", "invoice_issued", "payment_refunded"]>;
export declare const notificationChannelSchema: z.ZodEnum<["email"]>;
export declare const notificationStatusSchema: z.ZodEnum<["pending", "sent", "failed"]>;
export declare const currencySchema: z.ZodLiteral<"INR">;
export declare const planSnapshotSchema: z.ZodObject<{
    planId: z.ZodString;
    planGroup: z.ZodString;
    name: z.ZodString;
    billingInterval: z.ZodEnum<["MONTHLY", "YEARLY"]>;
    priceInPaise: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    planId: string;
    planGroup: string;
    name: string;
    billingInterval: "MONTHLY" | "YEARLY";
    priceInPaise: number;
}, {
    planId: string;
    planGroup: string;
    name: string;
    billingInterval: "MONTHLY" | "YEARLY";
    priceInPaise: number;
}>;
export declare const isoDateStringSchema: z.ZodString;
export declare const paginationQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
}, {
    page?: number | undefined;
    limit?: number | undefined;
}>;
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
//# sourceMappingURL=common.d.ts.map