import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'RegisterKaro Subscriptions',
  description: 'Subscription billing platform',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
