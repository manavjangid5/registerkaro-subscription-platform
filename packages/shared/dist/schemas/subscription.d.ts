import { z } from 'zod';
export declare const createSubscriptionRequestSchema: z.ZodObject<{
    planId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    planId: string;
}, {
    planId: string;
}>;
export declare const subscriptionIdParamSchema: z.ZodObject<{
    subscriptionId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    subscriptionId: string;
}, {
    subscriptionId: string;
}>;
export declare const upgradeSubscriptionRequestSchema: z.ZodObject<{
    planId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    planId: string;
}, {
    planId: string;
}>;
export declare const downgradeSubscriptionRequestSchema: z.ZodObject<{
    planId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    planId: string;
}, {
    planId: string;
}>;
export declare const subscriptionResponseSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
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
    status: z.ZodEnum<["pending", "active", "past_due", "canceled", "expired"]>;
    currentPeriodStart: z.ZodString;
    currentPeriodEnd: z.ZodString;
    cancelAtPeriodEnd: z.ZodBoolean;
    canceledAt: z.ZodNullable<z.ZodString>;
    scheduledPlanSnapshot: z.ZodNullable<z.ZodObject<{
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
    }>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "active" | "past_due" | "canceled" | "expired";
    id: string;
    createdAt: string;
    userId: string;
    planSnapshot: {
        planId: string;
        planGroup: string;
        name: string;
        billingInterval: "MONTHLY" | "YEARLY";
        priceInPaise: number;
    };
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    canceledAt: string | null;
    scheduledPlanSnapshot: {
        planId: string;
        planGroup: string;
        name: string;
        billingInterval: "MONTHLY" | "YEARLY";
        priceInPaise: number;
    } | null;
    updatedAt: string;
}, {
    status: "pending" | "active" | "past_due" | "canceled" | "expired";
    id: string;
    createdAt: string;
    userId: string;
    planSnapshot: {
        planId: string;
        planGroup: string;
        name: string;
        billingInterval: "MONTHLY" | "YEARLY";
        priceInPaise: number;
    };
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    canceledAt: string | null;
    scheduledPlanSnapshot: {
        planId: string;
        planGroup: string;
        name: string;
        billingInterval: "MONTHLY" | "YEARLY";
        priceInPaise: number;
    } | null;
    updatedAt: string;
}>;
export declare const listSubscriptionsResponseSchema: z.ZodObject<{
    subscriptions: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        userId: z.ZodString;
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
        status: z.ZodEnum<["pending", "active", "past_due", "canceled", "expired"]>;
        currentPeriodStart: z.ZodString;
        currentPeriodEnd: z.ZodString;
        cancelAtPeriodEnd: z.ZodBoolean;
        canceledAt: z.ZodNullable<z.ZodString>;
        scheduledPlanSnapshot: z.ZodNullable<z.ZodObject<{
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
        }>>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        status: "pending" | "active" | "past_due" | "canceled" | "expired";
        id: string;
        createdAt: string;
        userId: string;
        planSnapshot: {
            planId: string;
            planGroup: string;
            name: string;
            billingInterval: "MONTHLY" | "YEARLY";
            priceInPaise: number;
        };
        currentPeriodStart: string;
        currentPeriodEnd: string;
        cancelAtPeriodEnd: boolean;
        canceledAt: string | null;
        scheduledPlanSnapshot: {
            planId: string;
            planGroup: string;
            name: string;
            billingInterval: "MONTHLY" | "YEARLY";
            priceInPaise: number;
        } | null;
        updatedAt: string;
    }, {
        status: "pending" | "active" | "past_due" | "canceled" | "expired";
        id: string;
        createdAt: string;
        userId: string;
        planSnapshot: {
            planId: string;
            planGroup: string;
            name: string;
            billingInterval: "MONTHLY" | "YEARLY";
            priceInPaise: number;
        };
        currentPeriodStart: string;
        currentPeriodEnd: string;
        cancelAtPeriodEnd: boolean;
        canceledAt: string | null;
        scheduledPlanSnapshot: {
            planId: string;
            planGroup: string;
            name: string;
            billingInterval: "MONTHLY" | "YEARLY";
            priceInPaise: number;
        } | null;
        updatedAt: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    subscriptions: {
        status: "pending" | "active" | "past_due" | "canceled" | "expired";
        id: string;
        createdAt: string;
        userId: string;
        planSnapshot: {
            planId: string;
            planGroup: string;
            name: string;
            billingInterval: "MONTHLY" | "YEARLY";
            priceInPaise: number;
        };
        currentPeriodStart: string;
        currentPeriodEnd: string;
        cancelAtPeriodEnd: boolean;
        canceledAt: string | null;
        scheduledPlanSnapshot: {
            planId: string;
            planGroup: string;
            name: string;
            billingInterval: "MONTHLY" | "YEARLY";
            priceInPaise: number;
        } | null;
        updatedAt: string;
    }[];
}, {
    subscriptions: {
        status: "pending" | "active" | "past_due" | "canceled" | "expired";
        id: string;
        createdAt: string;
        userId: string;
        planSnapshot: {
            planId: string;
            planGroup: string;
            name: string;
            billingInterval: "MONTHLY" | "YEARLY";
            priceInPaise: number;
        };
        currentPeriodStart: string;
        currentPeriodEnd: string;
        cancelAtPeriodEnd: boolean;
        canceledAt: string | null;
        scheduledPlanSnapshot: {
            planId: string;
            planGroup: string;
            name: string;
            billingInterval: "MONTHLY" | "YEARLY";
            priceInPaise: number;
        } | null;
        updatedAt: string;
    }[];
}>;
export declare const checkoutSessionResponseSchema: z.ZodObject<{
    subscriptionId: z.ZodString;
    paymentId: z.ZodString;
    razorpayOrderId: z.ZodString;
    amountInPaise: z.ZodNumber;
    currency: z.ZodLiteral<"INR">;
    razorpayKeyId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    currency: "INR";
    subscriptionId: string;
    paymentId: string;
    razorpayOrderId: string;
    amountInPaise: number;
    razorpayKeyId: string;
}, {
    currency: "INR";
    subscriptionId: string;
    paymentId: string;
    razorpayOrderId: string;
    amountInPaise: number;
    razorpayKeyId: string;
}>;
export type CreateSubscriptionRequest = z.infer<typeof createSubscriptionRequestSchema>;
export type UpgradeSubscriptionRequest = z.infer<typeof upgradeSubscriptionRequestSchema>;
export type DowngradeSubscriptionRequest = z.infer<typeof downgradeSubscriptionRequestSchema>;
export type SubscriptionResponse = z.infer<typeof subscriptionResponseSchema>;
export type ListSubscriptionsResponse = z.infer<typeof listSubscriptionsResponseSchema>;
export type CheckoutSessionResponse = z.infer<typeof checkoutSessionResponseSchema>;
//# sourceMappingURL=subscription.d.ts.map