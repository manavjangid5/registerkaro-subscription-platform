import type { BillingInterval } from '@registerkaro/shared';

export function computePeriodEnd(start: Date, interval: BillingInterval): Date {
  const end = new Date(start);
  if (interval === 'MONTHLY') {
    end.setMonth(end.getMonth() + 1);
  } else {
    end.setFullYear(end.getFullYear() + 1);
  }
  return end;
}