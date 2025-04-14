'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  HomeIcon,
  UsersIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { usePermissions } from '@/hooks/usePermissions';

interface SidebarProps {
  isOpen: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export default function Sidebar({
  isOpen,
  onMouseEnter,
  onMouseLeave,
}: SidebarProps) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const { check, userRole } = usePermissions();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const links = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: HomeIcon,
      show: true,
    },
    {
      href: '/dashboard/users',
      label: 'Usuarios',
      icon: UsersIcon,
      show: check('users', 'read'),
    },
    {
      href: '/dashboard/clientes',
      label: 'Clientes',
      icon: UserGroupIcon,
      show: check('clients', 'read'),
    },
    {
      href: '/dashboard/tipos-de-servicio',
      label: 'Tipos de Servicio',
      icon: WrenchScrewdriverIcon,
      show: check('service-types', 'read'),
    },
    {
      href: '/dashboard/profile',
      label: 'Mi Perfil',
      icon: UserIcon,
      show: check('profile', 'read'),
    },
  ];

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300',
        isOpen ? 'w-64' : 'w-16'
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="h-full px-3 py-4 overflow-y-auto">
        <ul className="space-y-2">
          {links.filter(link => link.show).map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link href={href}>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start gap-2',
                    pathname === href && 'bg-gray-100 dark:bg-gray-800'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span
                    className={cn(
                      'transition-opacity',
                      isOpen ? 'opacity-100' : 'opacity-0'
                    )}
                  >
                    {label}
                  </span>
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
} 