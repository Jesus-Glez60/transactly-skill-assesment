import { montserrat } from '@/app/fonts';
import '@/app/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Transactly Weather',
  description: 'Weather app',
};

export const experimental_ppr = true;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>
        <main className="flex min-h-dvh flex-col gap-8">{children}</main>
      </body>
    </html>
  );
}
