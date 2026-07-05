'use client';

import type { PlanResponse, SubscriptionResponse } from '@registerkaro/shared';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { apiRequest } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';

function formatRupees(paise: number): string {
  return `₹${(paise / 100).toLocaleString('en-IN')}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function SubscriptionsPage() {
  const { user, accessToken, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [subscription, setSubscription] = useState<SubscriptionResponse | null>(null);
  const [plans, setPlans] = useState<PlanResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [previewAmount, setPreviewAmount] = useState<{ planId: string; amount: number } | null>(
    null,
  );

  useEffect(() => {
    if (authLoading) return;
    if (!user || !accessToken) {
      router.push('/login');
      return;
    }

    Promise.all([
      apiRequest<{ subscription: SubscriptionResponse | null }>('/subscriptions/me', {
        accessToken,
      }),
      apiRequest<{ plans: PlanResponse[] }>('/plans'),
    ])
      .then(([subData, planData]) => {
        setSubscription(subData.subscription);
        setPlans(planData.plans);
      })
      .finally(() => setIsLoading(false));
  }, [authLoading, user, accessToken, router]);

  async function refresh(): Promise<void> {
    if (!accessToken) return;
    const data = await apiRequest<{ subscription: SubscriptionResponse | null }>(
      '/subscriptions/me',
      { accessToken },
    );
    setSubscription(data.subscription);
  }

  async function handlePreview(planId: string): Promise<void> {
    if (!accessToken) return;
    const result = await apiRequest<{ amountDueInPaise: number }>(
      `/subscriptions/preview-change?planId=${planId}`,
      { accessToken },
    );
    setPreviewAmount({ planId, amount: result.amountDueInPaise });
  }

  async function handleUpgrade(planId: string): Promise<void> {
    if (!accessToken) return;
    setActionMessage(null);
    const result = await apiRequest<{
      status: string;
      razorpayOrderId?: string;
      amountInPaise?: number;
      razorpayKeyId?: string;
    }>('/subscriptions/upgrade', { method: 'POST', body: { planId }, accessToken });

    if (result.status === 'applied_immediately') {
      setActionMessage('Plan upgraded immediately (no remaining time to prorate).');
      await refresh();
      return;
    }

    if (result.razorpayOrderId && result.razorpayKeyId && result.amountInPaise) {
      const checkout = new window.Razorpay({
        key: result.razorpayKeyId,
        amount: result.amountInPaise,
        currency: 'INR',
        name: 'RegisterKaro Subscriptions',
        description: 'Plan upgrade',
        order_id: result.razorpayOrderId,
        prefill: { name: user?.name, email: user?.email },
        handler: () => {
          setActionMessage(
            'Payment submitted — confirming with your bank. Refresh in a few seconds.',
          );
        },
      });
      checkout.open();
    }
  }

  async function handleDowngrade(planId: string): Promise<void> {
    if (!accessToken) return;
    setActionMessage(null);
    const result = await apiRequest<{ effectiveDate: string }>('/subscriptions/downgrade', {
      method: 'POST',
      body: { planId },
      accessToken,
    });
    setActionMessage(`Downgrade scheduled. It will take effect on ${formatDate(result.effectiveDate)}.`);
    await refresh();
  }

  async function handleCancel(): Promise<void> {
    if (!accessToken) return;
    if (!confirm('Cancel your subscription? You will keep access until the end of your current billing period.')) {
      return;
    }
    setActionMessage(null);
    const result = await apiRequest<{ accessUntil: string }>('/subscriptions/cancel', {
      method: 'POST',
      accessToken,
    });
    setActionMessage(`Subscription canceled. You'll retain access until ${formatDate(result.accessUntil)}.`);
    await refresh();
  }

  async function handleResume(): Promise<void> {
    if (!accessToken) return;
    setActionMessage(null);
    await apiRequest('/subscriptions/resume', { method: 'POST', accessToken });
    setActionMessage('Subscription resumed — it will continue renewing as normal.');
    await refresh();
  }

  if (authLoading || isLoading) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <p className="text-zinc-500">Loading…</p>
      </main>
    );
  }

  if (!subscription) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="text-2xl font-semibold">No subscription yet</h1>
        <p className="mt-2 text-zinc-500">Choose a plan to get started.</p>
        
        <a  href="/pricing"
          className="mt-6 inline-block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          View plans
        </a>
      </main>
    );
  }

  const otherPlans = plans.filter((p) => p.id !== subscription.planSnapshot.planId);

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-semibold">Your subscription</h1>

      <div className="mt-6 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-medium">
              {subscription.planSnapshot.name} ({subscription.planSnapshot.billingInterval})
            </p>
            <p className="text-zinc-500">{formatRupees(subscription.planSnapshot.priceInPaise)}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              subscription.status === 'active' && !subscription.cancelAtPeriodEnd
                ? 'bg-green-100 text-green-800'
                : subscription.cancelAtPeriodEnd
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-zinc-100 text-zinc-800'
            }`}
          >
            {subscription.cancelAtPeriodEnd
              ? `Canceling — ends ${formatDate(subscription.currentPeriodEnd)}`
              : subscription.status === 'active'
                ? 'Active'
                : subscription.status}
          </span>
        </div>

        {!subscription.cancelAtPeriodEnd && (
          <p className="mt-4 text-sm text-zinc-500">
            Next billing date: {formatDate(subscription.currentPeriodEnd)}
          </p>
        )}

        {subscription.scheduledPlanSnapshot && (
          <p className="mt-2 text-sm text-amber-700">
            {subscription.scheduledPlanSnapshot.priceInPaise > subscription.planSnapshot.priceInPaise
              ? `Upgrade to ${subscription.scheduledPlanSnapshot.name} (${subscription.scheduledPlanSnapshot.billingInterval}) is pending payment confirmation.`
              : `Switching to ${subscription.scheduledPlanSnapshot.name} (${subscription.scheduledPlanSnapshot.billingInterval}) on ${formatDate(subscription.currentPeriodEnd)}.`}
          </p>
        )}

        {actionMessage && (
          <p className="mt-4 rounded-md bg-blue-50 px-4 py-2 text-sm text-blue-800">
            {actionMessage}
          </p>
        )}

        <div className="mt-6 flex gap-3">
          {subscription.cancelAtPeriodEnd ? (
            <button
              onClick={handleResume}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
            >
              Resume subscription
            </button>
          ) : (
            <button
              onClick={handleCancel}
              className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700"
            >
              Cancel subscription
            </button>
          )}
        </div>
      </div>

      {!subscription.cancelAtPeriodEnd && otherPlans.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-medium">Change plan</h2>
          <div className="mt-4 space-y-3">
            {otherPlans.map((plan) => (
              <div
                key={plan.id}
                className="flex items-center justify-between rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
              >
                <div>
                  <p className="font-medium">
                    {plan.name} ({plan.billingInterval})
                  </p>
                  <p className="text-sm text-zinc-500">{formatRupees(plan.priceInPaise)}</p>
                  {previewAmount?.planId === plan.id && (
                    <p className="mt-1 text-sm text-zinc-600">
                      Due now: {formatRupees(previewAmount.amount)}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePreview(plan.id)}
                    className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() =>
                      plan.priceInPaise > subscription.planSnapshot.priceInPaise
                        ? handleUpgrade(plan.id)
                        : handleDowngrade(plan.id)
                    }
                    className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
                  >
                    Switch
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}