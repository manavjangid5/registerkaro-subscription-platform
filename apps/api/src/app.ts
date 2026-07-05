import { healthResponseSchema } from '@registerkaro/shared';
import cors from 'cors';
import express, { type Express } from 'express';

import authRoutes from './routes/auth.routes.js';
import checkoutRoutes from './routes/checkout.routes.js';
import plansRoutes from './routes/plans.routes.js';
import subscriptionsRoutes from './routes/subscriptions.routes.js';
import webhookRoutes from './routes/webhooks.routes.js';
import './models/index.js';

export function createApp(): Express {
  const app = express();

  app.use(cors());

  // IMPORTANT: webhook routes are mounted BEFORE express.json(). Razorpay's
  // signature is computed over the raw request body — if express.json()
  // parses it first, the raw bytes are lost and signature verification
  // will always fail. The webhook router applies its own express.raw()
  // middleware internally for just that route.
  app.use('/webhooks', webhookRoutes);

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

  return app;
}