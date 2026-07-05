import type { SubscriptionResponse } from '@registerkaro/shared';
import { Router } from 'express';

import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.js';
import { Subscription, type SubscriptionDocument } from '../models/index.js';

const router = Router();

function toResponse(sub: SubscriptionDocument): SubscriptionResponse {
  return {
    id: sub._id.toString(),
    userId: sub.userId.toString(),
    planSnapshot: {
      planId: sub.planSnapshot.planId.toString(),
      planGroup: sub.planSnapshot.planGroup,
      name: sub.planSnapshot.name,
      billingInterval: sub.planSnapshot.billingInterval,
      priceInPaise: sub.planSnapshot.priceInPaise,
    },
    status: sub.status,
    currentPeriodStart: sub.currentPeriodStart.toISOString(),
    currentPeriodEnd: sub.currentPeriodEnd.toISOString(),
    cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
    canceledAt: sub.canceledAt ? sub.canceledAt.toISOString() : null,
    scheduledPlanSnapshot: sub.scheduledPlanSnapshot
      ? {
          planId: sub.scheduledPlanSnapshot.planId.toString(),
          planGroup: sub.scheduledPlanSnapshot.planGroup,
          name: sub.scheduledPlanSnapshot.name,
          billingInterval: sub.scheduledPlanSnapshot.billingInterval,
          priceInPaise: sub.scheduledPlanSnapshot.priceInPaise,
        }
      : null,
    createdAt: sub.createdAt.toISOString(),
    updatedAt: sub.updatedAt.toISOString(),
  };
}

router.get('/me', requireAuth, async (req: AuthenticatedRequest, res) => {
  const userId = req.userId!;

  // Most recent subscription regardless of status — lets the frontend show
  // "pending confirmation", "active", "canceled (ends on X)", or nothing.
  const subscription = await Subscription.findOne({ userId }).sort({ createdAt: -1 });

  if (!subscription) {
    res.status(200).json({ subscription: null });
    return;
  }

  res.status(200).json({ subscription: toResponse(subscription) });
});

export default router;