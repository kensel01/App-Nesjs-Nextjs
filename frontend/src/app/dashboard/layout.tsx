'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from '@/components/theme/ThemeProvider';
import Sidebar from '../../../components/layout/Sidebar';
import { MdDarkMode, MdLightMode, MdLogout } from 'react-icons/md';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Cargando...</div>;
  }

  if (!session) {
    return null;
  }

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-auto pl-20 lg:pl-64">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow">
          <div className="flex justify-end items-center px-4 py-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Cambiar tema"
            >
              {theme === 'dark' ? (
                <MdLightMode className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              ) : (
                <MdDarkMode className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              )}
            </button>
            <button
              onClick={handleLogout}
              className="ml-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Cerrar sesión"
            >
              <MdLogout className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
        <main className="py-6 px-4">{children}</main>
      </div>
    </div>
  );
} 