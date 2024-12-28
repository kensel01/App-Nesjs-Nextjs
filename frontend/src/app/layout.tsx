import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/src/providers/Providers';

export const metadata: Metadata = {
  title: 'App Nest Next',
  description: 'Aplicación con Next.js y Nest.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
