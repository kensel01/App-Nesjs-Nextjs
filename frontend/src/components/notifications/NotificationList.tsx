'use client';

import { useNotificationStore, Notification } from '@/store/notification';
import { Button } from '@/components/ui/button';
import { CheckIcon, TrashIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function NotificationList() {
  const { notifications, markAsRead, deleteNotification } = useNotificationStore();

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-sm text-muted-foreground">No tienes notificaciones</p>
      </div>
    );
  }

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <div className="h-2 w-2 rounded-full bg-green-500" />;
      case 'warning':
        return <div className="h-2 w-2 rounded-full bg-yellow-500" />;
      case 'destructive':
        return <div className="h-2 w-2 rounded-full bg-red-500" />;
      default:
        return <div className="h-2 w-2 rounded-full bg-blue-500" />;
    }
  };

  const formatTimestamp = (date: Date) => {
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: es,
    });
  };

  return (
    <div className="max-h-[400px] overflow-auto">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={cn(
            'flex items-start p-3 hover:bg-muted/50 border-b border-border',
            !notification.read && 'bg-muted/20'
          )}
        >
          <div className="mr-2 mt-1">{getNotificationIcon(notification.type)}</div>
          <div className="flex-1 min-w-0">
            {notification.link ? (
              <Link
                href={notification.link}
                className="font-medium text-sm"
                onClick={() => markAsRead(notification.id)}
              >
                {notification.title}
              </Link>
            ) : (
              <h4 className="font-medium text-sm">{notification.title}</h4>
            )}
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
            <div className="text-[10px] text-muted-foreground/75 mt-1">
              {formatTimestamp(notification.timestamp)}
            </div>
          </div>
          <div className="flex ml-2 space-x-1">
            {!notification.read && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                onClick={() => markAsRead(notification.id)}
                title="Marcar como leída"
              >
                <CheckIcon className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
              onClick={() => deleteNotification(notification.id)}
              title="Eliminar notificación"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
} 