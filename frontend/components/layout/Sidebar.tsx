'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { UserPlusIcon, UsersIcon } from '@heroicons/react/24/outline';
import { useSidebar } from '@/src/providers/SidebarProvider';
import clsx from 'clsx';

const menuItems = [
  {
    name: 'Crear Usuario',
    icon: UserPlusIcon,
    href: '/dashboard/users/create',
  },
  {
    name: 'Lista de Clientes',
    icon: UsersIcon,
    href: '/dashboard/clients',
  },
];

export default function Sidebar() {
  const { isExpanded, expandSidebar, collapseSidebar } = useSidebar();
  const pathname = usePathname();

  return (
    <motion.aside
      className={clsx(
        'fixed left-0 top-0 z-40 h-screen bg-gray-800 transition-all duration-300',
        isExpanded ? 'w-60' : 'w-16'
      )}
      onMouseEnter={expandSidebar}
      onMouseLeave={collapseSidebar}
      initial={false}
      animate={{ width: isExpanded ? 240 : 64 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex h-full flex-col px-3 py-4">
        <div className="mb-10 flex items-center justify-center">
          {/* Logo aquí */}
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  'flex items-center rounded-lg p-2 text-white transition-colors',
                  isActive
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'hover:bg-gray-700'
                )}
              >
                <item.icon className="h-6 w-6 shrink-0" />
                <motion.span
                  className="ml-3 whitespace-nowrap"
                  initial={false}
                  animate={{ opacity: isExpanded ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.name}
                </motion.span>
              </Link>
            );
          })}
        </nav>
      </div>
    </motion.aside>
  );
} 