import jwt from 'jsonwebtoken';
import { loadEnv } from '../config/env.js';
const env = loadEnv();
const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL = '7d';
export function signAccessToken(userId) {
    const payload = { userId, type: 'access' };
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_TTL });
}
export function signRefreshToken(userId) {
    const payload = { userId, type: 'refresh' };
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_TTL });
}
export function verifyAccessToken(token) {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
    if (typeof decoded === 'string' || decoded.type !== 'access') {
        throw new Error('Invalid access token');
    }
    return decoded;
}
export function verifyRefreshToken(token) {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
    if (typeof decoded === 'string' || decoded.type !== 'refresh') {
        throw new Error('Invalid refresh token');
    }
    return decoded;
}
