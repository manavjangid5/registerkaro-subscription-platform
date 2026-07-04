import 'dotenv/config';
import { healthResponseSchema } from '@registerkaro/shared';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import { loadEnv } from './config/env.js';
import './models/index.js';
import authRoutes from './routes/auth.routes.js';
const env = loadEnv();
const app = express();
app.use(cors());
app.use(express.json());
app.get('/health', (_req, res) => {
    const payload = healthResponseSchema.parse({
        status: 'ok',
        timestamp: new Date().toISOString(),
    });
    res.json(payload);
});
app.use('/auth', authRoutes);
async function start() {
    await mongoose.connect(env.MONGODB_URI);
    app.listen(env.PORT, () => {
        console.log(`API listening on http://localhost:${String(env.PORT)}`);
    });
}
start().catch((error) => {
    console.error('Failed to start API:', error);
    process.exit(1);
});
