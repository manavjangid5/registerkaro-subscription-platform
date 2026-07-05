export function generateInvoiceNumber(paymentId: string, periodStart: Date): string {
  const datePart = periodStart.toISOString().slice(0, 10).replace(/-/g, '');
  const shortPaymentId = paymentId.slice(-8);
  return `INV-${datePart}-${shortPaymentId}`;
}