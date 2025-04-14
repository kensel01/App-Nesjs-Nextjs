'use client';

import { useEffect } from 'react';
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
  const { isOpen, isMobile, setIsMobile } = useSidebarStore();

  // Actualizar el estado móvil en cambios de tamaño de ventana
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Establecer el valor inicial
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobile]);
  
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
        onMouseEnter={() => !isMobile && useSidebarStore.getState().setIsOpen(true)}
        onMouseLeave={() => !isMobile && useSidebarStore.getState().setIsOpen(false)}
      />
      <div 
        className={`flex-1 overflow-auto transition-all duration-300 w-full ${
          isOpen && !isMobile ? 'lg:pl-64' : 'lg:pl-16'
        }`}
      >
        <Header />
        <main className="container mx-auto py-4 px-3 sm:py-6 sm:px-4">
          {children}
        </main>
      </div>
    </div>
  );
} 