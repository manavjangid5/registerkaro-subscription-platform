import { z } from 'zod';
export declare const planResponseSchema: z.ZodObject<{
    id: z.ZodString;
    planGroup: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    billingInterval: z.ZodEnum<["MONTHLY", "YEARLY"]>;
    priceInPaise: z.ZodNumber;
    currency: z.ZodLiteral<"INR">;
    features: z.ZodArray<z.ZodString, "many">;
    sortOrder: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    planGroup: string;
    name: string;
    billingInterval: "MONTHLY" | "YEARLY";
    priceInPaise: number;
    id: string;
    description: string;
    currency: "INR";
    features: string[];
    sortOrder: number;
}, {
    planGroup: string;
    name: string;
    billingInterval: "MONTHLY" | "YEARLY";
    priceInPaise: number;
    id: string;
    description: string;
    currency: "INR";
    features: string[];
    sortOrder: number;
}>;
export declare const listPlansResponseSchema: z.ZodObject<{
    plans: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        planGroup: z.ZodString;
        name: z.ZodString;
        description: z.ZodString;
        billingInterval: z.ZodEnum<["MONTHLY", "YEARLY"]>;
        priceInPaise: z.ZodNumber;
        currency: z.ZodLiteral<"INR">;
        features: z.ZodArray<z.ZodString, "many">;
        sortOrder: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        planGroup: string;
        name: string;
        billingInterval: "MONTHLY" | "YEARLY";
        priceInPaise: number;
        id: string;
        description: string;
        currency: "INR";
        features: string[];
        sortOrder: number;
    }, {
        planGroup: string;
        name: string;
        billingInterval: "MONTHLY" | "YEARLY";
        priceInPaise: number;
        id: string;
        description: string;
        currency: "INR";
        features: string[];
        sortOrder: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    plans: {
        planGroup: string;
        name: string;
        billingInterval: "MONTHLY" | "YEARLY";
        priceInPaise: number;
        id: string;
        description: string;
        currency: "INR";
        features: string[];
        sortOrder: number;
    }[];
}, {
    plans: {
        planGroup: string;
        name: string;
        billingInterval: "MONTHLY" | "YEARLY";
        priceInPaise: number;
        id: string;
        description: string;
        currency: "INR";
        features: string[];
        sortOrder: number;
    }[];
}>;
export declare const planGroupParamSchema: z.ZodObject<{
    planGroup: z.ZodString;
}, "strip", z.ZodTypeAny, {
    planGroup: string;
}, {
    planGroup: string;
}>;
export declare const planIdParamSchema: z.ZodObject<{
    planId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    planId: string;
}, {
    planId: string;
}>;
export type PlanResponse = z.infer<typeof planResponseSchema>;
export type ListPlansResponse = z.infer<typeof listPlansResponseSchema>;
//# sourceMappingURL=plan.d.ts.map