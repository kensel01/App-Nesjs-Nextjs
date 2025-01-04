'use client';

import { useAuth } from '@/hooks/useAuth';
import { useSidebarStore } from '@/store/sidebar';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const { status, isLoading } = useAuth();
  const isOpen = useSidebarStore((state) => state.isOpen);
  const setIsOpen = useSidebarStore((state) => state.setIsOpen);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar
        isOpen={isOpen}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      />
      <div className={`flex-1 overflow-auto transition-all duration-300 ${
        isOpen ? 'pl-64' : 'pl-16'
      }`}>
        <Header />
        <main className="container mx-auto py-6 px-4">
          {children}
        </main>
      </div>
    </div>
  );
} 