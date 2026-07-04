import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 px-6 py-16">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">RegisterKaro</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Subscription Platform</h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Monorepo scaffold is ready. Auth, checkout, and billing flows will be wired up next.
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          Sign in
        </Link>
        <Link
          href="/register"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium dark:border-zinc-700"
        >
          Create account
        </Link>
      </div>
    </main>
  );
}
