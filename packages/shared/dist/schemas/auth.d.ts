import { z } from 'zod';
export declare const registerRequestSchema: z.ZodObject<{
    email: z.ZodEffects<z.ZodString, string, string>;
    password: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    name: string;
    password: string;
}, {
    email: string;
    name: string;
    password: string;
}>;
export declare const loginRequestSchema: z.ZodObject<{
    email: z.ZodEffects<z.ZodString, string, string>;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const refreshTokenRequestSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    refreshToken: string;
}, {
    refreshToken: string;
}>;
export declare const authTokensResponseSchema: z.ZodObject<{
    accessToken: z.ZodString;
    refreshToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    refreshToken: string;
    accessToken: string;
}, {
    refreshToken: string;
    accessToken: string;
}>;
export declare const userResponseSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodEffects<z.ZodString, string, string>;
    name: z.ZodString;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    name: string;
    id: string;
    createdAt: string;
}, {
    email: string;
    name: string;
    id: string;
    createdAt: string;
}>;
export declare const authResponseSchema: z.ZodObject<{
    user: z.ZodObject<{
        id: z.ZodString;
        email: z.ZodEffects<z.ZodString, string, string>;
        name: z.ZodString;
        createdAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        email: string;
        name: string;
        id: string;
        createdAt: string;
    }, {
        email: string;
        name: string;
        id: string;
        createdAt: string;
    }>;
    tokens: z.ZodObject<{
        accessToken: z.ZodString;
        refreshToken: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        refreshToken: string;
        accessToken: string;
    }, {
        refreshToken: string;
        accessToken: string;
    }>;
}, "strip", z.ZodTypeAny, {
    user: {
        email: string;
        name: string;
        id: string;
        createdAt: string;
    };
    tokens: {
        refreshToken: string;
        accessToken: string;
    };
}, {
    user: {
        email: string;
        name: string;
        id: string;
        createdAt: string;
    };
    tokens: {
        refreshToken: string;
        accessToken: string;
    };
}>;
export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type RefreshTokenRequest = z.infer<typeof refreshTokenRequestSchema>;
export type AuthTokensResponse = z.infer<typeof authTokensResponseSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
//# sourceMappingURL=auth.d.ts.map