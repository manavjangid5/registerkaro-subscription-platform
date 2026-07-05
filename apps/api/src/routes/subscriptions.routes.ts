import {
  downgradeSubscriptionRequestSchema,
  upgradeSubscriptionRequestSchema,
  type SubscriptionResponse,
} from '@registerkaro/shared';
import { Router } from 'express';

import { loadEnv } from '../config/env.js';
import { computePeriodEnd } from '../lib/billing-period.js';
import { decidePlanChangeKind } from '../lib/plan-change.js';
import { calculateUpgradeProration } from '../lib/proration.js';
import { razorpay } from '../lib/razorpay.js';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.js';
import { validateBody, type ValidatedRequest } from '../middleware/validate.js';
import {
  Payment,
  Plan,
  Subscription,
  type SubscriptionDocument,
} from '../models/index.js';

const env = loadEnv();
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
  const subscription = await Subscription.findOne({ userId }).sort({ createdAt: -1 });

  if (!subscription) {
    res.status(200).json({ subscription: null });
    return;
  }

  res.status(200).json({ subscription: toResponse(subscription) });
});

// Returns the cost of a would-be upgrade WITHOUT committing anything, so
// the frontend can show "this will cost ₹X" before the user confirms.
router.get('/preview-change', requireAuth, async (req: AuthenticatedRequest, res) => {
  const userId = req.userId!;
  const newPlanId = req.query.planId as string | undefined;

  if (!newPlanId) {
    res.status(400).json({ error: 'planId query parameter is required' });
    return;
  }

  const subscription = await Subscription.findOne({ userId, status: 'active' });
  if (!subscription) {
    res.status(404).json({ error: 'No active subscription found' });
    return;
  }

  const newPlan = await Plan.findOne({ _id: newPlanId, isActive: true });
  if (!newPlan) {
    res.status(404).json({ error: 'Plan not found' });
    return;
  }

  const decision = decidePlanChangeKind(
    subscription.planSnapshot.priceInPaise,
    newPlan.priceInPaise,
    subscription.planSnapshot.billingInterval,
    newPlan.billingInterval,
    subscription.planSnapshot.planId.toString(),
    newPlan._id.toString(),
  );

  if (decision.kind === 'no_change') {
    res.status(200).json({ kind: 'no_change', amountDueInPaise: 0 });
    return;
  }

  if (decision.kind === 'downgrade') {
    res.status(200).json({
      kind: 'downgrade',
      amountDueInPaise: 0,
      effectiveDate: subscription.currentPeriodEnd.toISOString(),
    });
    return;
  }

  const amountDueInPaise = calculateUpgradeProration({
    currentPlanPriceInPaise: subscription.planSnapshot.priceInPaise,
    newPlanPriceInPaise: newPlan.priceInPaise,
    currentPeriodStart: subscription.currentPeriodStart,
    currentPeriodEnd: subscription.currentPeriodEnd,
    now: new Date(),
  });

  res.status(200).json({ kind: 'upgrade', amountDueInPaise, effectiveDate: 'immediately' });
});

// Upgrade: charges a prorated amount immediately via a new Razorpay order.
// The plan does NOT change yet — it changes only when the webhook confirms
// this payment (see webhooks.routes.ts handling of purpose 'upgrade_proration').
router.post(
  '/upgrade',
  requireAuth,
  validateBody(upgradeSubscriptionRequestSchema),
  async (req: AuthenticatedRequest, res) => {
    const userId = req.userId!;
    const { planId } = (req as ValidatedRequest<{ planId: string }>).validatedBody!;

    const subscription = await Subscription.findOne({ userId, status: 'active' });
    if (!subscription) {
      res.status(404).json({ error: 'No active subscription to upgrade' });
      return;
    }

    const newPlan = await Plan.findOne({ _id: planId, isActive: true });
    if (!newPlan) {
      res.status(404).json({ error: 'Plan not found' });
      return;
    }

    const decision = decidePlanChangeKind(
      subscription.planSnapshot.priceInPaise,
      newPlan.priceInPaise,
      subscription.planSnapshot.billingInterval,
      newPlan.billingInterval,
      subscription.planSnapshot.planId.toString(),
      newPlan._id.toString(),
    );

    if (decision.kind !== 'upgrade') {
      res.status(400).json({
        error: 'This plan change is not an upgrade. Use /subscriptions/downgrade instead.',
      });
      return;
    }

    const amountDueInPaise = calculateUpgradeProration({
      currentPlanPriceInPaise: subscription.planSnapshot.priceInPaise,
      newPlanPriceInPaise: newPlan.priceInPaise,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
      now: new Date(),
    });

    if (amountDueInPaise === 0) {
      // No time remaining to prorate — apply immediately without a charge.
      subscription.planSnapshot = {
        planId: newPlan._id,
        planGroup: newPlan.planGroup,
        name: newPlan.name,
        billingInterval: newPlan.billingInterval,
        priceInPaise: newPlan.priceInPaise,
      };
      await subscription.save();
      res.status(200).json({ status: 'applied_immediately', subscription: toResponse(subscription) });
      return;
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: amountDueInPaise,
      currency: 'INR',
      receipt: `u_${subscription._id.toString().slice(-10)}`,
      notes: {
        subscriptionId: subscription._id.toString(),
        userId,
        purpose: 'upgrade_proration',
        newPlanId: newPlan._id.toString(),
      },
    });

    const payment = await Payment.create({
      subscriptionId: subscription._id,
      userId,
      amountInPaise: amountDueInPaise,
      currency: 'INR',
      status: 'created',
      purpose: 'upgrade_proration',
      razorpayOrderId: razorpayOrder.id,
      idempotencyKey: `${subscription._id.toString()}:upgrade:${newPlan._id.toString()}:${Date.now()}`,
    });

    // Stash the target plan on the subscription so the webhook handler
    // knows what to switch to once this payment is captured — it cannot
    // apply the new plan yet since the charge isn't confirmed.
    subscription.scheduledPlanSnapshot = {
      planId: newPlan._id,
      planGroup: newPlan.planGroup,
      name: newPlan.name,
      billingInterval: newPlan.billingInterval,
      priceInPaise: newPlan.priceInPaise,
    };
    await subscription.save();

    res.status(201).json({
      status: 'payment_required',
      paymentId: payment._id.toString(),
      razorpayOrderId: razorpayOrder.id,
      amountInPaise: amountDueInPaise,
      currency: 'INR',
      razorpayKeyId: env.RAZORPAY_KEY_ID,
    });
  },
);

// Downgrade: no charge, no immediate access change. The new plan is stored
// as scheduledPlanSnapshot and applied by the cron sweep at period end.
router.post(
  '/downgrade',
  requireAuth,
  validateBody(downgradeSubscriptionRequestSchema),
  async (req: AuthenticatedRequest, res) => {
    const userId = req.userId!;
    const { planId } = (req as ValidatedRequest<{ planId: string }>).validatedBody!;

    const subscription = await Subscription.findOne({ userId, status: 'active' });
    if (!subscription) {
      res.status(404).json({ error: 'No active subscription to downgrade' });
      return;
    }

    const newPlan = await Plan.findOne({ _id: planId, isActive: true });
    if (!newPlan) {
      res.status(404).json({ error: 'Plan not found' });
      return;
    }

    const decision = decidePlanChangeKind(
      subscription.planSnapshot.priceInPaise,
      newPlan.priceInPaise,
      subscription.planSnapshot.billingInterval,
      newPlan.billingInterval,
      subscription.planSnapshot.planId.toString(),
      newPlan._id.toString(),
    );

    if (decision.kind !== 'downgrade') {
      res.status(400).json({
        error: 'This plan change is not a downgrade. Use /subscriptions/upgrade instead.',
      });
      return;
    }

    subscription.scheduledPlanSnapshot = {
      planId: newPlan._id,
      planGroup: newPlan.planGroup,
      name: newPlan.name,
      billingInterval: newPlan.billingInterval,
      priceInPaise: newPlan.priceInPaise,
    };
    await subscription.save();

    res.status(200).json({
      status: 'scheduled',
      effectiveDate: subscription.currentPeriodEnd.toISOString(),
      subscription: toResponse(subscription),
    });
  },
);

// Cancel does NOT revoke access immediately — access continues until
// currentPeriodEnd. The cron sweep flips status to 'expired' once that
// date passes. This matches the Prime/SaaS "paid time is honored" convention
// documented in ARCHITECTURE.md.
router.post('/cancel', requireAuth, async (req: AuthenticatedRequest, res) => {
  const userId = req.userId!;

  const subscription = await Subscription.findOne({ userId, status: 'active' });
  if (!subscription) {
    res.status(404).json({ error: 'No active subscription to cancel' });
    return;
  }

  subscription.cancelAtPeriodEnd = true;
  subscription.canceledAt = new Date();
  // Clear any pending downgrade — a cancellation supersedes a scheduled
  // plan change; there is nothing to downgrade INTO if it's ending anyway.
  subscription.scheduledPlanSnapshot = null;
  await subscription.save();

  res.status(200).json({
    status: 'cancel_scheduled',
    accessUntil: subscription.currentPeriodEnd.toISOString(),
    subscription: toResponse(subscription),
  });
});

// Resume is only valid while status is still 'active' with
// cancelAtPeriodEnd=true, and before currentPeriodEnd has actually passed.
// Once the cron sweep has flipped status to 'expired', resuming requires a
// fresh checkout instead — that's a deliberate boundary, not an oversight.
router.post('/resume', requireAuth, async (req: AuthenticatedRequest, res) => {
  const userId = req.userId!;

  const subscription = await Subscription.findOne({
    userId,
    status: 'active',
    cancelAtPeriodEnd: true,
  });

  if (!subscription) {
    res.status(404).json({
      error: 'No cancellation-pending subscription found to resume',
    });
    return;
  }

  if (subscription.currentPeriodEnd.getTime() <= Date.now()) {
    res.status(409).json({
      error: 'The billing period has already ended. Please start a new subscription.',
    });
    return;
  }

  subscription.cancelAtPeriodEnd = false;
  subscription.canceledAt = null;
  await subscription.save();

  res.status(200).json({ status: 'resumed', subscription: toResponse(subscription) });
});

export default router;