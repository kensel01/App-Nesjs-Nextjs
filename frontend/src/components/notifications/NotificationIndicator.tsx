'use client';

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';

type Notification = {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  link?: string;
};

interface NotificationIndicatorProps {
  className?: string;
}

export function NotificationIndicator({ className }: NotificationIndicatorProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  // Contar notificaciones no leídas
  const unreadCount = notifications.filter(n => !n.read).length;

  // Simular la obtención de notificaciones
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        // En un entorno real, esta sería la llamada al API
        // const response = await fetch('/api/v1/notifications');
        // const data = await response.json();

        // Simulamos datos de notificaciones
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Datos de ejemplo
        const mockNotifications: Notification[] = [
          {
            id: '1',
            title: 'Nueva tarea asignada',
            message: 'Se te ha asignado una nueva tarea para revisar.',
            date: new Date(Date.now() - 3600000).toISOString(),
            read: false,
            link: '/dashboard/tasks/1',
          },
          {
            id: '2',
            title: 'Actualización de sistema',
            message: 'El sistema se actualizará mañana a las 00:00 horas.',
            date: new Date(Date.now() - 86400000).toISOString(),
            read: false,
          },
          {
            id: '3',
            title: 'Comentario nuevo',
            message: 'Alguien ha comentado en tu publicación.',
            date: new Date(Date.now() - 259200000).toISOString(),
            read: true,
            link: '/dashboard/comments/123',
          },
        ];

        setNotifications(mockNotifications);
      } catch (error) {
        console.error('Error al cargar notificaciones:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Marcar una notificación como leída
  const markAsRead = async (id: string) => {
    try {
      // En un entorno real, esta sería la llamada al API
      // await fetch(`/api/v1/notifications/${id}/read`, { method: 'PUT' });
      
      // Actualizar estado local
      setNotifications(
        notifications.map(notification =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
    }
  };

  // Marcar todas las notificaciones como leídas
  const markAllAsRead = async () => {
    try {
      // En un entorno real, esta sería la llamada al API
      // await fetch('/api/v1/notifications/read-all', { method: 'PUT' });
      
      // Actualizar estado local
      setNotifications(
        notifications.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error('Error al marcar todas las notificaciones como leídas:', error);
    }
  };

  // Formatear fecha relativa
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Hace un momento';
    if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} minutos`;
    if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
    if (diffInSeconds < 604800) return `Hace ${Math.floor(diffInSeconds / 86400)} días`;
    
    // Si es más de una semana, mostramos la fecha
    return date.toLocaleDateString();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("relative", className)}
          onClick={() => setOpen(true)}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notificaciones</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              className="text-xs h-auto py-1"
              onClick={markAllAsRead}
            >
              Marcar todas como leídas
            </Button>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-sm text-muted-foreground">Cargando notificaciones...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-sm text-muted-foreground">No tienes notificaciones</p>
          </div>
        ) : (
          <>
            <ScrollArea className="max-h-[300px]">
              <div className="divide-y">
                {notifications.map(notification => {
                  const NotificationItem = (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 hover:bg-accent cursor-pointer transition-colors",
                        !notification.read && "bg-accent/40"
                      )}
                      onClick={() => {
                        markAsRead(notification.id);
                        if (notification.link) {
                          setOpen(false);
                        }
                      }}
                    >
                      <div className="space-y-1">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {formatRelativeTime(notification.date)}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  );

                  return notification.link ? (
                    <Link href={notification.link} key={notification.id}>
                      {NotificationItem}
                    </Link>
                  ) : (
                    NotificationItem
                  );
                })}
              </div>
            </ScrollArea>
            
            <div className="p-2 border-t text-center">
              <Link 
                href="/dashboard/notifications"
                className="text-xs text-muted-foreground hover:text-primary hover:underline inline-block p-2"
                onClick={() => setOpen(false)}
              >
                Ver todas las notificaciones
              </Link>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
} 