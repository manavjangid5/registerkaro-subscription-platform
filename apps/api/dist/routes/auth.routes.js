import { loginRequestSchema, refreshTokenRequestSchema, registerRequestSchema, } from '@registerkaro/shared';
import { Router } from 'express';
import { comparePassword, hashPassword } from '../lib/password.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../lib/jwt.js';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { User } from '../models/index.js';
const router = Router();
router.post('/register', validateBody(registerRequestSchema), async (req, res) => {
    const { email, password, name } = req
        .validatedBody;
    // Case-insensitive uniqueness check — schema already lowercases on save,
    // but we check against the same normalized form here too.
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
        res.status(409).json({ error: 'An account with this email already exists' });
        return;
    }
    const passwordHash = await hashPassword(password);
    const user = await User.create({ email, passwordHash, name });
    const accessToken = signAccessToken(user._id.toString());
    const refreshToken = signRefreshToken(user._id.toString());
    const response = {
        user: {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            createdAt: user.createdAt.toISOString(),
        },
        tokens: { accessToken, refreshToken },
    };
    res.status(201).json(response);
});
router.post('/login', validateBody(loginRequestSchema), async (req, res) => {
    const { email, password } = req.validatedBody;
    const user = await User.findOne({ email: email.toLowerCase() });
    // Deliberately identical error for "no such user" and "wrong password" —
    // never reveal which one it was, that's a user-enumeration leak.
    if (!user) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
    }
    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
    }
    const accessToken = signAccessToken(user._id.toString());
    const refreshToken = signRefreshToken(user._id.toString());
    const response = {
        user: {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            createdAt: user.createdAt.toISOString(),
        },
        tokens: { accessToken, refreshToken },
    };
    res.status(200).json(response);
});
router.post('/refresh', validateBody(refreshTokenRequestSchema), async (req, res) => {
    const { refreshToken } = req
        .validatedBody;
    let payload;
    try {
        payload = verifyRefreshToken(refreshToken);
    }
    catch {
        res.status(401).json({ error: 'Invalid or expired refresh token' });
        return;
    }
    const user = await User.findById(payload.userId);
    if (!user) {
        res.status(401).json({ error: 'User no longer exists' });
        return;
    }
    // Rotate both tokens on every refresh — the old refresh token is not
    // reusable in practice since the client discards it immediately after.
    const newAccessToken = signAccessToken(user._id.toString());
    const newRefreshToken = signRefreshToken(user._id.toString());
    res.status(200).json({
        tokens: { accessToken: newAccessToken, refreshToken: newRefreshToken },
    });
});
router.post('/logout', (_req, res) => {
    // Stateless JWTs — logout is a client-side token discard. Noted as a
    // known limitation in ARCHITECTURE.md: a stolen access token remains
    // valid until its 15-minute expiry even after "logout".
    res.status(200).json({ success: true });
});
router.get('/me', requireAuth, async (req, res) => {
    const user = await User.findById(req.userId);
    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    res.status(200).json({
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        createdAt: user.createdAt.toISOString(),
    });
});
export default router;
