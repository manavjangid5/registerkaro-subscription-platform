export const BILLING_INTERVALS = ['MONTHLY', 'YEARLY'];
export const SUBSCRIPTION_STATUSES = [
    'pending',
    'active',
    'past_due',
    'canceled',
    'expired',
];
export const PAYMENT_STATUSES = [
    'created',
    'pending',
    'authorized',
    'captured',
    'failed',
    'refunded',
];
export const PAYMENT_PURPOSES = [
    'initial',
    'renewal',
    'upgrade_proration',
    'refund_reversal',
];
export const INVOICE_STATUSES = ['issued', 'paid', 'void'];
export const WEBHOOK_EVENT_STATUSES = ['received', 'processing', 'processed', 'failed'];
export const NOTIFICATION_TYPES = [
    'subscription_activated',
    'payment_failed',
    'subscription_canceled',
    'invoice_issued',
    'payment_refunded',
];
export const NOTIFICATION_CHANNELS = ['email'];
export const NOTIFICATION_STATUSES = ['pending', 'sent', 'failed'];
export const CURRENCY = 'INR';
//# sourceMappingURL=entities.js.map