import type { BillingInterval } from '@registerkaro/shared';

import { computePeriodEnd } from './billing-period.js';
import { isUpgrade } from './proration.js';

export interface PlanChangeDecision {
  kind: 'upgrade' | 'downgrade' | 'no_change';
}

export function decidePlanChangeKind(
  currentPriceInPaise: number,
  newPriceInPaise: number,
  currentInterval: BillingInterval,
  newInterval: BillingInterval,
  currentPlanId: string,
  newPlanId: string,
): PlanChangeDecision {
  if (currentPlanId === newPlanId) {
    return { kind: 'no_change' };
  }
  const upgrade = isUpgrade(currentPriceInPaise, newPriceInPaise, currentInterval, newInterval);
  return { kind: upgrade ? 'upgrade' : 'downgrade' };
}

export { computePeriodEnd };