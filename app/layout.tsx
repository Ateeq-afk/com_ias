import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Community IAS - Premium UPSC Preparation Platform',
  description: 'Transform your UPSC preparation with interactive lessons, AI-powered learning, and comprehensive test series.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" data-theme="light" style={{colorScheme: 'light'}}>
      <body className={`${inter.className} bg-white text-gray-900`} style={{backgroundColor: '#FAFAFA', color: 'rgba(0, 0, 0, 0.87)'}}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
