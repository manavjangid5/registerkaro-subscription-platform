import { createSubscriptionRequestSchema, type CheckoutSessionResponse } from '@registerkaro/shared';
import { Router } from 'express';

import { loadEnv } from '../config/env.js';
import { razorpay } from '../lib/razorpay.js';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.js';
import { validateBody, type ValidatedRequest } from '../middleware/validate.js';
import { Payment, Plan, Subscription } from '../models/index.js';

const env = loadEnv();
const router = Router();

router.post(
  '/',
  requireAuth,
  validateBody(createSubscriptionRequestSchema),
  async (req: AuthenticatedRequest, res) => {
    const userId = req.userId!;
    const { planId } = (req as ValidatedRequest<{ planId: string }>).validatedBody!;

    const plan = await Plan.findOne({ _id: planId, isActive: true });
    if (!plan) {
      res.status(404).json({ error: 'Plan not found or no longer available' });
      return;
    }

    // A user with an already-active subscription must go through the
    // plan-change flow (Prompt 6), not fresh checkout — prevents a second
    // simultaneous active subscription for the same user.
    const activeSub = await Subscription.findOne({ userId, status: 'active' });
    if (activeSub) {
      res.status(409).json({
        error: 'You already have an active subscription. Use plan change instead.',
        code: 'ALREADY_SUBSCRIBED',
      });
      return;
    }

    // Idempotency guard against double-submit / double-click: if a pending
    // checkout for this exact plan already exists and hasn't been superseded,
    // reuse it instead of creating a duplicate subscription + Razorpay order.
    const existingPending = await Subscription.findOne({
      userId,
      status: 'pending',
      'planSnapshot.planId': plan._id,
    }).sort({ createdAt: -1 });

    if (existingPending) {
      const existingPayment = await Payment.findOne({
        subscriptionId: existingPending._id,
        status: { $in: ['created', 'pending'] },
      }).sort({ createdAt: -1 });

      if (existingPayment) {
        const response: CheckoutSessionResponse = {
          subscriptionId: existingPending._id.toString(),
          paymentId: existingPayment._id.toString(),
          razorpayOrderId: existingPayment.razorpayOrderId,
          amountInPaise: existingPayment.amountInPaise,
          currency: 'INR',
          razorpayKeyId: env.RAZORPAY_KEY_ID,
        };
        res.status(200).json(response);
        return;
      }
    }

    // currentPeriodStart/End are placeholders until the webhook confirms
    // payment and sets the real billing period (see Prompt 5). Subscription
    // is NOT active yet — this is the "pending" state in the state machine.
    const now = new Date();
    const subscription = new Subscription({
      userId,
      planSnapshot: {
        planId: plan._id,
        planGroup: plan.planGroup,
        name: plan.name,
        billingInterval: plan.billingInterval,
        priceInPaise: plan.priceInPaise,
      },
      status: 'pending',
      currentPeriodStart: now,
      currentPeriodEnd: now,
      cancelAtPeriodEnd: false,
    });
    await subscription.save();

    const razorpayOrder = await razorpay.orders.create({
      amount: plan.priceInPaise,
      currency: 'INR',
      receipt: `sub_${subscription._id.toString()}`,
      notes: { subscriptionId: subscription._id.toString(), userId, purpose: 'initial' },
    });

    const payment = await Payment.create({
      subscriptionId: subscription._id,
      userId,
      amountInPaise: plan.priceInPaise,
      currency: 'INR',
      status: 'created',
      purpose: 'initial',
      razorpayOrderId: razorpayOrder.id,
      idempotencyKey: `${subscription._id.toString()}:initial`,
    });

    const response: CheckoutSessionResponse = {
      subscriptionId: subscription._id.toString(),
      paymentId: payment._id.toString(),
      razorpayOrderId: razorpayOrder.id,
      amountInPaise: plan.priceInPaise,
      currency: 'INR',
      razorpayKeyId: env.RAZORPAY_KEY_ID,
    };

    res.status(201).json(response);
  },
);

export default router;