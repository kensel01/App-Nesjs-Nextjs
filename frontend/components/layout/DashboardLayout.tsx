'use client';

import { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <main className="transition-all duration-300 pl-16 hover:pl-60">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>
    </div>
  );
} 