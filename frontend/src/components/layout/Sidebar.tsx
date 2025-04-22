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
  XMarkIcon,
  UserPlusIcon,
  ArrowDownIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { usePermissions } from '@/hooks/usePermissions';
import { useSidebarStore } from '@/store/sidebar';
import { useSession } from 'next-auth/react';

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
  const { isMobile, setIsMobile, toggle } = useSidebarStore();
  const { data: session } = useSession();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  // Expandir automáticamente un menú si estamos en una ruta dentro de él
  useEffect(() => {
    if (pathname.startsWith('/dashboard/users')) {
      setExpandedMenus(prev => ({ ...prev, users: true }));
    }
  }, [pathname]);

  // Actualizar el estado móvil en cambios de tamaño de ventana
  useEffect(() => {
    setIsMounted(true);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Establecer el valor inicial
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobile]);

  if (!isMounted) {
    return null;
  }

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  // Determinar si el usuario es administrador
  const isAdmin = session?.user?.role === 'admin';

  const links = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: HomeIcon,
      show: true,
    },
    {
      id: 'users',
      label: 'Usuarios',
      icon: UsersIcon,
      show: check('users', 'read'),
      submenu: true,
      expanded: expandedMenus['users'] || false,
      items: [
        {
          href: '/dashboard/users',
          label: 'Listado de Usuarios',
          icon: UsersIcon,
          show: check('users', 'read'),
        },
        {
          href: '/dashboard/users/create',
          label: 'Crear Usuario',
          icon: UserPlusIcon,
          show: check('users', 'create'),
        },
      ],
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

  // Cerrar sidebar al cambiar de ruta en móviles
  const handleLinkClick = () => {
    if (isMobile) {
      toggle();
    }
  };

  return (
    <>
      {/* Backdrop oscuro para móviles */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggle}
          aria-hidden="true"
        />
      )}
      
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300',
          isOpen 
            ? isMobile 
              ? 'w-64 translate-x-0' 
              : 'w-64' 
            : isMobile 
              ? '-translate-x-full' 
              : 'w-16'
        )}
        onMouseEnter={!isMobile ? onMouseEnter : undefined}
        onMouseLeave={!isMobile ? onMouseLeave : undefined}
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          {isMobile && (
            <div className="flex justify-end mb-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggle}
                className="lg:hidden"
                aria-label="Cerrar menú"
              >
                <XMarkIcon className="h-6 w-6" />
              </Button>
            </div>
          )}
          
          <ul className="space-y-2">
            {links.filter(link => link.show).map((link) => (
              <li key={link.id || link.href}>
                {link.submenu ? (
                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      className={cn(
                        'w-full justify-between gap-2 py-6 text-base',
                        (pathname.startsWith(link.href || '') || link.expanded) && 'bg-gray-100 dark:bg-gray-800'
                      )}
                      onClick={() => toggleMenu(link.id || '')}
                    >
                      <div className="flex items-center">
                        <link.icon className="h-5 w-5 flex-shrink-0 mr-2" />
                        <span
                          className={cn(
                            'transition-opacity whitespace-nowrap',
                            (isOpen || isMobile) ? 'opacity-100' : 'opacity-0'
                          )}
                        >
                          {link.label}
                        </span>
                      </div>
                      {(isOpen || isMobile) && (
                        link.expanded 
                          ? <ChevronDownIcon className="h-4 w-4" />
                          : <ChevronRightIcon className="h-4 w-4" />
                      )}
                    </Button>
                    
                    {link.expanded && (
                      <ul className="pl-8 space-y-1">
                        {link.items?.filter(item => item.show).map((item) => (
                          <li key={item.href}>
                            <Link href={item.href} onClick={handleLinkClick}>
                              <Button
                                variant="ghost"
                                className={cn(
                                  'w-full justify-start gap-2 py-3 text-sm',
                                  pathname === item.href && 'bg-gray-100 dark:bg-gray-800'
                                )}
                              >
                                <item.icon className="h-4 w-4 flex-shrink-0" />
                                <span className="whitespace-nowrap">
                                  {item.label}
                                </span>
                              </Button>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link href={link.href || ''} onClick={handleLinkClick}>
                    <Button
                      variant="ghost"
                      className={cn(
                        'w-full justify-start gap-2 py-6 text-base',
                        pathname === link.href && 'bg-gray-100 dark:bg-gray-800'
                      )}
                    >
                      <link.icon className="h-5 w-5 flex-shrink-0" />
                      <span
                        className={cn(
                          'transition-opacity whitespace-nowrap',
                          (isOpen || isMobile) ? 'opacity-100' : 'opacity-0'
                        )}
                      >
                        {link.label}
                      </span>
                    </Button>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
} 