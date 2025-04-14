'use client';

import { useState } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { useNotificationStore } from '@/store/notification';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import NotificationList from './NotificationList';

export default function NotificationIndicator() {
  const { unreadCount } = useNotificationStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          <span className="sr-only">Ver notificaciones</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between p-2">
          <h3 className="font-medium">Notificaciones</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => useNotificationStore.getState().markAllAsRead()}
            className="text-xs"
          >
            Marcar todas como leídas
          </Button>
        </div>
        <DropdownMenuSeparator />
        <NotificationList />
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 