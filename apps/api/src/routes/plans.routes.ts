import type { PlanResponse } from '@registerkaro/shared';
import { Router } from 'express';

import { Plan } from '../models/index.js';

const router = Router();

router.get('/', async (_req, res) => {
  const plans = await Plan.find({ isActive: true }).sort({ sortOrder: 1 });

  const response: PlanResponse[] = plans.map((plan) => ({
    id: plan._id.toString(),
    planGroup: plan.planGroup,
    name: plan.name,
    description: plan.description,
    billingInterval: plan.billingInterval,
    priceInPaise: plan.priceInPaise,
    currency: plan.currency,
    features: plan.features,
    sortOrder: plan.sortOrder,
  }));

  res.status(200).json({ plans: response });
});

export default router;