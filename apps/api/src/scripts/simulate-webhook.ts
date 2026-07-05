import 'dotenv/config';
import crypto from 'node:crypto';

import { loadEnv } from '../config/env.js';

const env = loadEnv();

const API_URL = `http://localhost:${env.PORT}`;

async function main(): Promise<void> {
  const razorpayOrderId = process.argv[2];
  const eventType = process.argv[3] ?? 'payment.captured';

  if (!razorpayOrderId) {
    console.error('Usage: tsx simulate-webhook.ts <razorpayOrderId> [eventType]');
    console.error('Example: tsx simulate-webhook.ts order_ABC123 payment.captured');
    process.exit(1);
  }

  const fakePaymentId = `pay_sim_${razorpayOrderId}`;

  const payload = {
    entity: 'event',
    account_id: 'acc_test',
    event: eventType,
    contains: ['payment'],
    payload: {
      payment: {
        entity: {
          id: fakePaymentId,
          order_id: razorpayOrderId,
          amount: 29900,
          currency: 'INR',
          status: eventType === 'payment.captured' ? 'captured' : 'failed',
          error_description: eventType === 'payment.failed' ? 'Simulated failure' : null,
        },
      },
    },
    created_at: Math.floor(Date.now() / 1000),
  };

  const rawBody = JSON.stringify(payload);
  const signature = crypto
    .createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');

  const res = await fetch(`${API_URL}/webhooks/razorpay`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-razorpay-signature': signature,
    },
    body: rawBody,
  });

  const data: unknown = await res.json().catch(() => null);
  console.log(`Status: ${res.status}`);
  console.log('Response:', data);
  console.log(`\nSimulated payment id: ${fakePaymentId}`);
  console.log(`To replay this EXACT event (test idempotency), run the same command again.`);
}

main().catch((error: unknown) => {
  console.error('Simulation failed:', error);
  process.exit(1);
});