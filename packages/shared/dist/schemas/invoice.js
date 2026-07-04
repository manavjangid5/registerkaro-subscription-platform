import { z } from 'zod';
import { currencySchema, invoiceStatusSchema, isoDateStringSchema, objectIdSchema, paiseSchema, planSnapshotSchema, } from './common.js';
export const invoiceResponseSchema = z.object({
    id: objectIdSchema,
    subscriptionId: objectIdSchema,
    userId: objectIdSchema,
    paymentId: objectIdSchema,
    planSnapshot: planSnapshotSchema,
    amountInPaise: paiseSchema,
    currency: currencySchema,
    periodStart: isoDateStringSchema,
    periodEnd: isoDateStringSchema,
    status: invoiceStatusSchema,
    invoiceNumber: z.string(),
    issuedAt: isoDateStringSchema,
    paidAt: isoDateStringSchema.nullable(),
    createdAt: isoDateStringSchema,
});
export const listInvoicesResponseSchema = z.object({
    invoices: z.array(invoiceResponseSchema),
});
export const invoiceIdParamSchema = z.object({
    invoiceId: objectIdSchema,
});
//# sourceMappingURL=invoice.js.map