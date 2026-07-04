import { z } from 'zod';
import { emailSchema, objectIdSchema, passwordSchema } from './common.js';
export const registerRequestSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    name: z.string().trim().min(1, 'Name is required').max(128),
});
export const loginRequestSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required'),
});
export const refreshTokenRequestSchema = z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
});
export const authTokensResponseSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
});
export const userResponseSchema = z.object({
    id: objectIdSchema,
    email: emailSchema,
    name: z.string(),
    createdAt: z.string(),
});
export const authResponseSchema = z.object({
    user: userResponseSchema,
    tokens: authTokensResponseSchema,
});
//# sourceMappingURL=auth.js.map