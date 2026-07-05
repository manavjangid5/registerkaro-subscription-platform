import 'dotenv/config';

import { healthResponseSchema } from '@registerkaro/shared';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';

import { loadEnv } from './config/env.js';
import './models/index.js';
import authRoutes from './routes/auth.routes.js';
import checkoutRoutes from './routes/checkout.routes.js';
import plansRoutes from './routes/plans.routes.js';
import subscriptionsRoutes from './routes/subscriptions.routes.js';

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
app.use('/plans', plansRoutes);
app.use('/checkout', checkoutRoutes);
app.use('/subscriptions', subscriptionsRoutes);

async function start(): Promise<void> {
  await mongoose.connect(env.MONGODB_URI);
  app.listen(env.PORT, () => {
    console.log(`API listening on http://localhost:${String(env.PORT)}`);
  });
}

start().catch((error: unknown) => {
  console.error('Failed to start API:', error);
  process.exit(1);
});