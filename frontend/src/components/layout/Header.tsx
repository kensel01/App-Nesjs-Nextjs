'use client';

import { MdDarkMode, MdLightMode, MdLogout, MdMenu } from 'react-icons/md';
import { useTheme } from '@/components/theme/ThemeProvider';
import { useAuth } from '@/hooks/useAuth';
import { useSidebarStore } from '@/store/sidebar';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { handleLogout } = useAuth();
  const toggle = useSidebarStore((state) => state.toggle);
  const { isMobile } = useSidebarStore();
  const { data: session } = useSession();
  
  const userName = session?.user?.name || 'Usuario';
  const userRole = session?.user?.role || '';

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow">
      <div className="flex justify-between items-center px-2 py-2 md:px-4 md:py-3">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="mr-2"
            aria-label="Toggle sidebar"
          >
            <MdMenu className="w-5 h-5 md:w-6 md:h-6" />
          </Button>
          
          <h1 className="text-lg font-semibold hidden md:block">Panel de control</h1>
        </div>

        <div className="flex items-center space-x-1 md:space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
            className="w-8 h-8 md:w-10 md:h-10"
          >
            {theme === 'dark' ? (
              <MdLightMode className="w-5 h-5 md:w-6 md:h-6" />
            ) : (
              <MdDarkMode className="w-5 h-5 md:w-6 md:h-6" />
            )}
          </Button>

          {/* Menú desplegable para usuario móvil */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-8 h-8 md:w-10 md:h-10"
                aria-label="Menú de usuario"
              >
                <UserIcon className="w-5 h-5 md:w-6 md:h-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{userName}</span>
                  <span className="text-xs text-gray-500 capitalize">{userRole}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/dashboard/profile">
                <DropdownMenuItem>
                  Mi perfil
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={handleLogout}>
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
} 