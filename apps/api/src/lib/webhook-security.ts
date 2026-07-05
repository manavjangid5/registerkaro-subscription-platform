import crypto from 'node:crypto';

export function verifyRazorpaySignature(
  rawBody: Buffer,
  signatureHeader: string | undefined,
  webhookSecret: string,
): boolean {
  if (!signatureHeader) return false;

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  // timingSafeEqual requires equal-length buffers, so mismatched lengths
  // (e.g. a forged short signature) must be checked before comparing —
  // otherwise timingSafeEqual itself throws instead of returning false.
  const expected = Buffer.from(expectedSignature, 'utf8');
  const received = Buffer.from(signatureHeader, 'utf8');
  if (expected.length !== received.length) return false;

  return crypto.timingSafeEqual(expected, received);
}

/**
 * Razorpay's webhook payload does not always guarantee a stable top-level
 * event id in test mode. We derive a deterministic idempotency key from the
 * event type + the underlying payment id, since a genuine retry of the same
 * event will always carry the same (event, payment id) pair. This is a
 * documented trade-off vs relying on a gateway-issued event id directly.
 */
export function deriveGatewayEventId(eventType: string, entityId: string): string {
  return `${eventType}:${entityId}`;
}