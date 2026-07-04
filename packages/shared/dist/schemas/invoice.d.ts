import { z } from 'zod';
export declare const invoiceResponseSchema: z.ZodObject<{
    id: z.ZodString;
    subscriptionId: z.ZodString;
    userId: z.ZodString;
    paymentId: z.ZodString;
    planSnapshot: z.ZodObject<{
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
    amountInPaise: z.ZodNumber;
    currency: z.ZodLiteral<"INR">;
    periodStart: z.ZodString;
    periodEnd: z.ZodString;
    status: z.ZodEnum<["issued", "paid", "void"]>;
    invoiceNumber: z.ZodString;
    issuedAt: z.ZodString;
    paidAt: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "issued" | "paid" | "void";
    id: string;
    createdAt: string;
    currency: "INR";
    subscriptionId: string;
    userId: string;
    planSnapshot: {
        planId: string;
        planGroup: string;
        name: string;
        billingInterval: "MONTHLY" | "YEARLY";
        priceInPaise: number;
    };
    paymentId: string;
    amountInPaise: number;
    periodStart: string;
    periodEnd: string;
    invoiceNumber: string;
    issuedAt: string;
    paidAt: string | null;
}, {
    status: "issued" | "paid" | "void";
    id: string;
    createdAt: string;
    currency: "INR";
    subscriptionId: string;
    userId: string;
    planSnapshot: {
        planId: string;
        planGroup: string;
        name: string;
        billingInterval: "MONTHLY" | "YEARLY";
        priceInPaise: number;
    };
    paymentId: string;
    amountInPaise: number;
    periodStart: string;
    periodEnd: string;
    invoiceNumber: string;
    issuedAt: string;
    paidAt: string | null;
}>;
export declare const listInvoicesResponseSchema: z.ZodObject<{
    invoices: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        subscriptionId: z.ZodString;
        userId: z.ZodString;
        paymentId: z.ZodString;
        planSnapshot: z.ZodObject<{
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
        amountInPaise: z.ZodNumber;
        currency: z.ZodLiteral<"INR">;
        periodStart: z.ZodString;
        periodEnd: z.ZodString;
        status: z.ZodEnum<["issued", "paid", "void"]>;
        invoiceNumber: z.ZodString;
        issuedAt: z.ZodString;
        paidAt: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        status: "issued" | "paid" | "void";
        id: string;
        createdAt: string;
        currency: "INR";
        subscriptionId: string;
        userId: string;
        planSnapshot: {
            planId: string;
            planGroup: string;
            name: string;
            billingInterval: "MONTHLY" | "YEARLY";
            priceInPaise: number;
        };
        paymentId: string;
        amountInPaise: number;
        periodStart: string;
        periodEnd: string;
        invoiceNumber: string;
        issuedAt: string;
        paidAt: string | null;
    }, {
        status: "issued" | "paid" | "void";
        id: string;
        createdAt: string;
        currency: "INR";
        subscriptionId: string;
        userId: string;
        planSnapshot: {
            planId: string;
            planGroup: string;
            name: string;
            billingInterval: "MONTHLY" | "YEARLY";
            priceInPaise: number;
        };
        paymentId: string;
        amountInPaise: number;
        periodStart: string;
        periodEnd: string;
        invoiceNumber: string;
        issuedAt: string;
        paidAt: string | null;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    invoices: {
        status: "issued" | "paid" | "void";
        id: string;
        createdAt: string;
        currency: "INR";
        subscriptionId: string;
        userId: string;
        planSnapshot: {
            planId: string;
            planGroup: string;
            name: string;
            billingInterval: "MONTHLY" | "YEARLY";
            priceInPaise: number;
        };
        paymentId: string;
        amountInPaise: number;
        periodStart: string;
        periodEnd: string;
        invoiceNumber: string;
        issuedAt: string;
        paidAt: string | null;
    }[];
}, {
    invoices: {
        status: "issued" | "paid" | "void";
        id: string;
        createdAt: string;
        currency: "INR";
        subscriptionId: string;
        userId: string;
        planSnapshot: {
            planId: string;
            planGroup: string;
            name: string;
            billingInterval: "MONTHLY" | "YEARLY";
            priceInPaise: number;
        };
        paymentId: string;
        amountInPaise: number;
        periodStart: string;
        periodEnd: string;
        invoiceNumber: string;
        issuedAt: string;
        paidAt: string | null;
    }[];
}>;
export declare const invoiceIdParamSchema: z.ZodObject<{
    invoiceId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    invoiceId: string;
}, {
    invoiceId: string;
}>;
export type InvoiceResponse = z.infer<typeof invoiceResponseSchema>;
export type ListInvoicesResponse = z.infer<typeof listInvoicesResponseSchema>;
//# sourceMappingURL=invoice.d.ts.map