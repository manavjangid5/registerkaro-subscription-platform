import type { BillingInterval } from '@registerkaro/shared';

/**
 * Calculates the prorated charge for an upgrade taking effect immediately,
 * mid-billing-cycle. Uses integer paise math throughout — no floats.
 *
 * Rounding rule: round-half-up on the final paise amount. Documented here
 * because proration inherently involves a division (remaining time / total
 * time), which cannot always land on a whole paise value.
 */
export function calculateUpgradeProration(params: {
  currentPlanPriceInPaise: number;
  newPlanPriceInPaise: number;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  now: Date;
}): number {
  const { currentPlanPriceInPaise, newPlanPriceInPaise, currentPeriodStart, currentPeriodEnd, now } =
    params;

  const totalPeriodMs = currentPeriodEnd.getTime() - currentPeriodStart.getTime();
  const remainingMs = Math.max(0, currentPeriodEnd.getTime() - now.getTime());

  if (totalPeriodMs <= 0) {
    // Defensive guard against a malformed period; should never happen if
    // computePeriodEnd was used correctly, but proration must never divide
    // by zero or go negative.
    return Math.max(0, newPlanPriceInPaise - currentPlanPriceInPaise);
  }

  const remainingFraction = remainingMs / totalPeriodMs;

  // Credit for unused time on the current plan, charge for the new plan's
  // price over that same remaining fraction. Round-half-up at the end.
  const unusedCreditInPaise = currentPlanPriceInPaise * remainingFraction;
  const newPlanProratedCostInPaise = newPlanPriceInPaise * remainingFraction;
  const rawDifference = newPlanProratedCostInPaise - unusedCreditInPaise;

  const roundedDifference = Math.round(rawDifference);

  // Never charge a negative amount for an upgrade — if the math somehow
  // nets negative (e.g. new plan cheaper, which shouldn't route through
  // upgrade at all), floor at zero rather than issuing a surprise credit.
  return Math.max(0, roundedDifference);
}

export function isUpgrade(
  currentPriceInPaise: number,
  newPriceInPaise: number,
  currentInterval: BillingInterval,
  newInterval: BillingInterval,
): boolean {
  // Interval change to YEARLY from MONTHLY is always treated as an upgrade
  // (locks in a longer commitment), regardless of raw price comparison.
  if (currentInterval === 'MONTHLY' && newInterval === 'YEARLY') return true;
  if (currentInterval === 'YEARLY' && newInterval === 'MONTHLY') return false;
  return newPriceInPaise > currentPriceInPaise;
}