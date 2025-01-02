'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSidebar } from '@/hooks/useSidebar';
import clsx from 'clsx';
import { FaUsers, FaUserPlus, FaUsersCog, FaTools } from 'react-icons/fa';
import { MdPeople, MdPersonAdd, MdPeopleOutline, MdDashboard, MdSettings } from 'react-icons/md';

interface MenuItem {
  title: string;
  path?: string;
  icon: JSX.Element;
  submenu?: boolean;
  submenuItems?: {
    title: string;
    path: string;
    icon: JSX.Element;
  }[];
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <MdDashboard className="w-6 h-6" />,
  },
  {
    title: 'Usuarios',
    icon: <FaUsers className="w-6 h-6" />,
    submenu: true,
    submenuItems: [
      {
        title: 'Lista de Usuarios',
        path: '/dashboard/users',
        icon: <FaUsersCog className="w-5 h-5" />,
      },
      {
        title: 'Crear Usuario',
        path: '/dashboard/users/create',
        icon: <FaUserPlus className="w-5 h-5" />,
      },
    ],
  },
  {
    title: 'Clientes',
    icon: <MdPeople className="w-6 h-6" />,
    submenu: true,
    submenuItems: [
      {
        title: 'Lista de Clientes',
        path: '/dashboard/clientes',
        icon: <MdPeopleOutline className="w-5 h-5" />,
      },
      {
        title: 'Crear Cliente',
        path: '/dashboard/clientes/create',
        icon: <MdPersonAdd className="w-5 h-5" />,
      },
    ],
  },
  {
    title: 'Tipos de Servicio',
    icon: <FaTools className="w-6 h-6" />,
    submenu: true,
    submenuItems: [
      {
        title: 'Lista de Tipos',
        path: '/dashboard/tipos-de-servicio',
        icon: <MdSettings className="w-5 h-5" />,
      },
      {
        title: 'Crear Tipo',
        path: '/dashboard/tipos-de-servicio/create',
        icon: <FaTools className="w-5 h-5" />,
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, toggleSubmenu, openSubmenuIndex, toggleSidebar } = useSidebar();

  return (
    <div
      className={clsx(
        'fixed left-0 top-0 h-screen bg-gray-900 text-white transition-all duration-300 ease-in-out z-50',
        isOpen ? 'w-64' : 'w-20'
      )}
      onMouseEnter={() => !isOpen && toggleSidebar()}
      onMouseLeave={() => isOpen && toggleSidebar()}
    >
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto">
          <nav className="mt-5 px-2">
            <div className="space-y-1">
              {menuItems.map((item, index) => (
                <div key={item.title}>
                  {item.submenu ? (
                    <>
                      <button
                        onClick={() => toggleSubmenu(index)}
                        className={clsx(
                          'group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium hover:bg-gray-800',
                          openSubmenuIndex === index ? 'bg-gray-800' : ''
                        )}
                      >
                        {item.icon}
                        <span
                          className={clsx(
                            'ml-3 flex-1 whitespace-nowrap',
                            !isOpen && 'hidden'
                          )}
                        >
                          {item.title}
                        </span>
                      </button>
                      {openSubmenuIndex === index && isOpen && (
                        <div className="space-y-1 pl-8">
                          {item.submenuItems?.map((subItem) => (
                            <Link
                              key={subItem.title}
                              href={subItem.path}
                              className={clsx(
                                'group flex items-center rounded-md px-2 py-2 text-sm font-medium hover:bg-gray-800',
                                pathname === subItem.path
                                  ? 'bg-gray-800 text-white'
                                  : 'text-gray-300'
                              )}
                            >
                              {subItem.icon}
                              <span className="ml-3">{subItem.title}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.path || '#'}
                      className={clsx(
                        'group flex items-center rounded-md px-2 py-2 text-sm font-medium hover:bg-gray-800',
                        pathname === item.path
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-300'
                      )}
                    >
                      {item.icon}
                      <span
                        className={clsx(
                          'ml-3 flex-1 whitespace-nowrap',
                          !isOpen && 'hidden'
                        )}
                      >
                        {item.title}
                      </span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
} 