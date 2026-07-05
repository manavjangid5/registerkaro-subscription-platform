'use client';

import type { SubscriptionResponse } from '@registerkaro/shared';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

import { apiRequest } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';

const POLL_INTERVAL_MS = 2000;
const MAX_POLLS = 10; // ~20 seconds total

function ConfirmingPaymentContent() {
  const { accessToken } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const subscriptionId = searchParams.get('subscriptionId');

  const [status, setStatus] = useState<'polling' | 'active' | 'timeout' | 'failed'>('polling');
  const [pollCount, setPollCount] = useState(0);

  useEffect(() => {
    if (!accessToken || !subscriptionId) return;
    if (pollCount >= MAX_POLLS) {
      setStatus('timeout');
      return;
    }

    const timer = setTimeout(() => {
      apiRequest<{ subscription: SubscriptionResponse | null }>('/subscriptions/me', {
        accessToken,
      })
        .then((data) => {
          if (data.subscription?.id === subscriptionId) {
            if (data.subscription.status === 'active') {
              setStatus('active');
              return;
            }
            if (data.subscription.status === 'pending') {
              setPollCount((c) => c + 1);
              return;
            }
          }
          setStatus('failed');
        })
        .catch(() => setPollCount((c) => c + 1));
    }, POLL_INTERVAL_MS);

    return () => clearTimeout(timer);
  }, [accessToken, subscriptionId, pollCount]);

  useEffect(() => {
    if (status === 'active') {
      const t = setTimeout(() => router.push('/subscriptions'), 1500);
      return () => clearTimeout(t);
    }
  }, [status, router]);

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      {status === 'polling' && (
        <>
          <h1 className="text-xl font-semibold">Confirming your payment…</h1>
          <p className="text-zinc-500">
            We&apos;re waiting for your bank to confirm the transaction. This usually takes a
            few seconds.
          </p>
        </>
      )}
      {status === 'active' && (
        <>
          <h1 className="text-xl font-semibold text-green-700">Payment confirmed!</h1>
          <p className="text-zinc-500">Redirecting to your subscription…</p>
        </>
      )}
      {status === 'timeout' && (
        <>
          <h1 className="text-xl font-semibold">Still processing</h1>
          <p className="text-zinc-500">
            This is taking longer than expected. We&apos;ll email you as soon as it&apos;s
            confirmed — no need to try again.
          </p>
        </>
      )}
      {status === 'failed' && (
        <>
          <h1 className="text-xl font-semibold text-red-700">Payment did not go through</h1>
          <p className="text-zinc-500">Please try again from the pricing page.</p>
        </>
      )}
    </main>
  );
}

export default function ConfirmingPaymentPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
          <p className="text-zinc-500">Loading…</p>
        </main>
      }
    >
      <ConfirmingPaymentContent />
    </Suspense>
  );
}