import { verifyAccessToken } from '../lib/jwt.js';
export function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Missing or malformed Authorization header' });
        return;
    }
    const token = authHeader.slice('Bearer '.length);
    try {
        const payload = verifyAccessToken(token);
        req.userId = payload.userId;
        next();
    }
    catch {
        res.status(401).json({ error: 'Invalid or expired access token' });
    }
}
