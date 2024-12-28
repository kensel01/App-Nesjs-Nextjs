'use client';

import { ReactNode } from 'react';
import AuthProvider from './AuthProvider';
import { SidebarProvider } from './SidebarProvider';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <SidebarProvider>
        {children}
      </SidebarProvider>
    </AuthProvider>
  );
} 