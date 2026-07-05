'use client';

import type { PlanResponse } from '@registerkaro/shared';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ApiError, apiRequest } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';

function formatRupees(paise: number): string {
  return `₹${(paise / 100).toLocaleString('en-IN')}`;
}

export default function PricingPage() {
  const { user, accessToken } = useAuth();
  const router = useRouter();

  const [plans, setPlans] = useState<PlanResponse[]>([]);
  const [interval, setInterval] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [isLoading, setIsLoading] = useState(true);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [pendingPlanId, setPendingPlanId] = useState<string | null>(null);

  useEffect(() => {
    apiRequest<{ plans: PlanResponse[] }>('/plans')
      .then((data) => setPlans(data.plans))
      .finally(() => setIsLoading(false));
  }, []);

  const visiblePlans = plans.filter((p) => p.billingInterval === interval);

  async function handleSubscribe(planId: string): Promise<void> {
    setCheckoutError(null);

    if (!user || !accessToken) {
      router.push('/login');
      return;
    }

    setPendingPlanId(planId);

    try {
      const session = await apiRequest<{
        subscriptionId: string;
        paymentId: string;
        razorpayOrderId: string;
        amountInPaise: number;
        currency: string;
        razorpayKeyId: string;
      }>('/checkout', {
        method: 'POST',
        body: { planId },
        accessToken,
      });

      const razorpayCheckout = new window.Razorpay({
        key: session.razorpayKeyId,
        amount: session.amountInPaise,
        currency: session.currency,
        name: 'RegisterKaro Subscriptions',
        description: 'Subscription checkout',
        order_id: session.razorpayOrderId,
        prefill: { name: user.name, email: user.email },
        theme: { color: '#18181b' },
        handler: () => {
          // Do NOT trust this callback as proof of payment — it only means
          // the widget finished. The webhook (server-to-server) is the
          // actual source of truth. Redirect to a page that polls
          // /subscriptions/me until the webhook has done its job.
          router.push(`/checkout/confirming?subscriptionId=${session.subscriptionId}`);
        },
        modal: {
          ondismiss: () => setPendingPlanId(null),
        },
      });

      razorpayCheckout.open();
    } catch (err) {
      setPendingPlanId(null);
      if (err instanceof ApiError && err.status === 409) {
        setCheckoutError('You already have an active subscription. Manage it from your account.');
      } else {
        setCheckoutError('Something went wrong starting checkout. Please try again.');
      }
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Pricing</h1>
      <p className="mt-2 text-zinc-500">Simple plans. Cancel anytime.</p>

      <div className="mt-6 inline-flex rounded-lg border border-zinc-300 p-1 dark:border-zinc-700">
        <button
          onClick={() => setInterval('MONTHLY')}
          className={`rounded-md px-4 py-1.5 text-sm font-medium ${
            interval === 'MONTHLY' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : ''
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setInterval('YEARLY')}
          className={`rounded-md px-4 py-1.5 text-sm font-medium ${
            interval === 'YEARLY' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : ''
          }`}
        >
          Yearly
        </button>
      </div>

      {checkoutError && (
        <p className="mt-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-700">{checkoutError}</p>
      )}

      {isLoading ? (
        <p className="mt-8 text-zinc-500">Loading plans…</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {visiblePlans.map((plan) => (
            <div key={plan.id} className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
              <h2 className="text-xl font-semibold">{plan.name}</h2>
              <p className="mt-1 text-sm text-zinc-500">{plan.description}</p>
              <p className="mt-4 text-3xl font-bold">
                {formatRupees(plan.priceInPaise)}
                <span className="text-base font-normal text-zinc-500">
                  /{plan.billingInterval === 'MONTHLY' ? 'mo' : 'yr'}
                </span>
              </p>
              <ul className="mt-4 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                {plan.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={pendingPlanId === plan.id}
                className="mt-6 w-full rounded-lg bg-zinc-900 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
              >
                {pendingPlanId === plan.id ? 'Opening checkout…' : `Subscribe to ${plan.name}`}
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}