import { z } from 'zod';
export declare const paymentResponseSchema: z.ZodObject<{
    id: z.ZodString;
    subscriptionId: z.ZodString;
    userId: z.ZodString;
    amountInPaise: z.ZodNumber;
    currency: z.ZodLiteral<"INR">;
    status: z.ZodEnum<["created", "pending", "authorized", "captured", "failed", "refunded"]>;
    purpose: z.ZodEnum<["initial", "renewal", "upgrade_proration", "refund_reversal"]>;
    razorpayOrderId: z.ZodString;
    razorpayPaymentId: z.ZodNullable<z.ZodString>;
    failureReason: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "created" | "authorized" | "captured" | "failed" | "refunded";
    id: string;
    createdAt: string;
    currency: "INR";
    subscriptionId: string;
    userId: string;
    updatedAt: string;
    razorpayOrderId: string;
    amountInPaise: number;
    purpose: "initial" | "renewal" | "upgrade_proration" | "refund_reversal";
    razorpayPaymentId: string | null;
    failureReason: string | null;
}, {
    status: "pending" | "created" | "authorized" | "captured" | "failed" | "refunded";
    id: string;
    createdAt: string;
    currency: "INR";
    subscriptionId: string;
    userId: string;
    updatedAt: string;
    razorpayOrderId: string;
    amountInPaise: number;
    purpose: "initial" | "renewal" | "upgrade_proration" | "refund_reversal";
    razorpayPaymentId: string | null;
    failureReason: string | null;
}>;
export declare const listPaymentsResponseSchema: z.ZodObject<{
    payments: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        subscriptionId: z.ZodString;
        userId: z.ZodString;
        amountInPaise: z.ZodNumber;
        currency: z.ZodLiteral<"INR">;
        status: z.ZodEnum<["created", "pending", "authorized", "captured", "failed", "refunded"]>;
        purpose: z.ZodEnum<["initial", "renewal", "upgrade_proration", "refund_reversal"]>;
        razorpayOrderId: z.ZodString;
        razorpayPaymentId: z.ZodNullable<z.ZodString>;
        failureReason: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        status: "pending" | "created" | "authorized" | "captured" | "failed" | "refunded";
        id: string;
        createdAt: string;
        currency: "INR";
        subscriptionId: string;
        userId: string;
        updatedAt: string;
        razorpayOrderId: string;
        amountInPaise: number;
        purpose: "initial" | "renewal" | "upgrade_proration" | "refund_reversal";
        razorpayPaymentId: string | null;
        failureReason: string | null;
    }, {
        status: "pending" | "created" | "authorized" | "captured" | "failed" | "refunded";
        id: string;
        createdAt: string;
        currency: "INR";
        subscriptionId: string;
        userId: string;
        updatedAt: string;
        razorpayOrderId: string;
        amountInPaise: number;
        purpose: "initial" | "renewal" | "upgrade_proration" | "refund_reversal";
        razorpayPaymentId: string | null;
        failureReason: string | null;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    payments: {
        status: "pending" | "created" | "authorized" | "captured" | "failed" | "refunded";
        id: string;
        createdAt: string;
        currency: "INR";
        subscriptionId: string;
        userId: string;
        updatedAt: string;
        razorpayOrderId: string;
        amountInPaise: number;
        purpose: "initial" | "renewal" | "upgrade_proration" | "refund_reversal";
        razorpayPaymentId: string | null;
        failureReason: string | null;
    }[];
}, {
    payments: {
        status: "pending" | "created" | "authorized" | "captured" | "failed" | "refunded";
        id: string;
        createdAt: string;
        currency: "INR";
        subscriptionId: string;
        userId: string;
        updatedAt: string;
        razorpayOrderId: string;
        amountInPaise: number;
        purpose: "initial" | "renewal" | "upgrade_proration" | "refund_reversal";
        razorpayPaymentId: string | null;
        failureReason: string | null;
    }[];
}>;
export declare const verifyPaymentRequestSchema: z.ZodObject<{
    razorpayOrderId: z.ZodString;
    razorpayPaymentId: z.ZodString;
    razorpaySignature: z.ZodString;
}, "strip", z.ZodTypeAny, {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
}, {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
}>;
export type PaymentResponse = z.infer<typeof paymentResponseSchema>;
export type ListPaymentsResponse = z.infer<typeof listPaymentsResponseSchema>;
export type VerifyPaymentRequest = z.infer<typeof verifyPaymentRequestSchema>;
//# sourceMappingURL=payment.d.ts.map