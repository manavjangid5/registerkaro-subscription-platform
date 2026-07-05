import { describe, expect, it } from 'vitest';

import { calculateUpgradeProration, isUpgrade } from './proration.js';

describe('calculateUpgradeProration', () => {
  it('charges roughly half the price difference at the midpoint of a 30-day period', () => {
    const currentPeriodStart = new Date('2026-07-01T00:00:00.000Z');
    const currentPeriodEnd = new Date('2026-07-31T00:00:00.000Z');
    const now = new Date('2026-07-16T00:00:00.000Z'); // 15 days remaining of 30

    const result = calculateUpgradeProration({
      currentPlanPriceInPaise: 29900, // ₹299
      newPlanPriceInPaise: 59900, // ₹599
      currentPeriodStart,
      currentPeriodEnd,
      now,
    });

    // Difference is 30000 paise over the full period; ~half remaining ≈ 15000
    expect(result).toBeGreaterThan(14000);
    expect(result).toBeLessThan(16000);
  });

  it('returns 0 when now equals currentPeriodEnd (no time remaining)', () => {
    const currentPeriodStart = new Date('2026-07-01T00:00:00.000Z');
    const currentPeriodEnd = new Date('2026-07-31T00:00:00.000Z');

    const result = calculateUpgradeProration({
      currentPlanPriceInPaise: 29900,
      newPlanPriceInPaise: 59900,
      currentPeriodStart,
      currentPeriodEnd,
      now: currentPeriodEnd,
    });

    expect(result).toBe(0);
  });

  it('never returns a negative amount', () => {
    const currentPeriodStart = new Date('2026-07-01T00:00:00.000Z');
    const currentPeriodEnd = new Date('2026-07-31T00:00:00.000Z');
    const now = new Date('2026-07-05T00:00:00.000Z');

    const result = calculateUpgradeProration({
      currentPlanPriceInPaise: 59900,
      newPlanPriceInPaise: 29900, // "upgrade" call with a cheaper plan — edge case
      currentPeriodStart,
      currentPeriodEnd,
      now,
    });

    expect(result).toBeGreaterThanOrEqual(0);
  });

  it('always returns an integer (paise), never a float', () => {
    const currentPeriodStart = new Date('2026-07-01T00:00:00.000Z');
    const currentPeriodEnd = new Date('2026-07-31T00:00:00.000Z');
    const now = new Date('2026-07-17T13:47:00.000Z'); // awkward, non-round time

    const result = calculateUpgradeProration({
      currentPlanPriceInPaise: 29900,
      newPlanPriceInPaise: 59900,
      currentPeriodStart,
      currentPeriodEnd,
      now,
    });

    expect(Number.isInteger(result)).toBe(true);
  });
});

describe('isUpgrade', () => {
  it('treats MONTHLY to YEARLY as an upgrade regardless of price', () => {
    expect(isUpgrade(59900, 10000, 'MONTHLY', 'YEARLY')).toBe(true);
  });

  it('treats YEARLY to MONTHLY as a downgrade regardless of price', () => {
    expect(isUpgrade(59900, 999900, 'YEARLY', 'MONTHLY')).toBe(false);
  });

  it('compares price directly when interval is unchanged', () => {
    expect(isUpgrade(29900, 59900, 'MONTHLY', 'MONTHLY')).toBe(true);
    expect(isUpgrade(59900, 29900, 'MONTHLY', 'MONTHLY')).toBe(false);
  });
});