import type { Metadata } from 'next';
import Script from 'next/script';

import { AuthProvider } from '@/lib/auth-context';

import './globals.css';

export const metadata: Metadata = {
  title: 'RegisterKaro Subscriptions',
  description: 'Subscription billing platform',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}