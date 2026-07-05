export function generateInvoiceNumber(subscriptionId: string, periodStart: Date): string {
    const datePart = periodStart.toISOString().slice(0, 10).replace(/-/g, '');
    const shortSubId = subscriptionId.slice(-6);
    return `INV-${datePart}-${shortSubId}`;
  }