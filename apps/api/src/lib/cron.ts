import cron from 'node-cron';

import { Subscription } from '../models/index.js';

/**
 * Runs every minute. Two responsibilities, kept in one sweep since both are
 * period-end-triggered transitions on the same collection:
 *
 * 1. Subscriptions with cancelAtPeriodEnd=true whose currentPeriodEnd has
 *    passed → flip to 'expired'. This is the only place cancellation
 *    actually revokes access — cancel() itself does not.
 * 2. Active subscriptions with a scheduledPlanSnapshot (a pending downgrade)
 *    whose currentPeriodEnd has passed → apply the new plan and start a
 *    fresh billing period.
 *
 * A real production system would use a durable job queue (e.g. BullMQ) so
 * sweeps survive a process restart without missing a tick. node-cron is an
 * accepted trade-off for this assignment's scope — documented in
 * ARCHITECTURE.md.
 */
export function startSubscriptionCron(): void {
  cron.schedule('* * * * *', () => {
    void runSweep();
  });
}

async function runSweep(): Promise<void> {
  const now = new Date();

  await expireCanceledSubscriptions(now);
  await applyScheduledDowngrades(now);
}

async function expireCanceledSubscriptions(now: Date): Promise<void> {
  const result = await Subscription.updateMany(
    {
      status: 'active',
      cancelAtPeriodEnd: true,
      currentPeriodEnd: { $lte: now },
    },
    { $set: { status: 'expired' } },
  );

  if (result.modifiedCount > 0) {
    console.log(`[cron] Expired ${String(result.modifiedCount)} canceled subscription(s).`);
  }
}

async function applyScheduledDowngrades(now: Date): Promise<void> {
  const dueSubscriptions = await Subscription.find({
    status: 'active',
    cancelAtPeriodEnd: false,
    scheduledPlanSnapshot: { $ne: null },
    currentPeriodEnd: { $lte: now },
  });

  for (const subscription of dueSubscriptions) {
    if (!subscription.scheduledPlanSnapshot) continue;

    const newPlanSnapshot = subscription.scheduledPlanSnapshot;
    const periodStart = now;
    const periodEnd = new Date(now);
    if (newPlanSnapshot.billingInterval === 'MONTHLY') {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    } else {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    }

    subscription.planSnapshot = newPlanSnapshot;
    subscription.scheduledPlanSnapshot = null;
    subscription.currentPeriodStart = periodStart;
    subscription.currentPeriodEnd = periodEnd;
    await subscription.save();

    console.log(
      `[cron] Applied scheduled downgrade for subscription ${subscription._id.toString()}.`,
    );
  }
}