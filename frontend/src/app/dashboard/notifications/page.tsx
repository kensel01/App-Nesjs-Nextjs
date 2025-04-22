'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CheckCheck, Bell, BellOff, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';

type Notification = {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  category: 'system' | 'task' | 'message';
  link?: string;
};

export default function NotificationsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

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
        
        // Datos de ejemplo con más notificaciones
        const mockNotifications: Notification[] = [
          {
            id: '1',
            title: 'Nueva tarea asignada',
            message: 'Se te ha asignado una nueva tarea para revisar el informe mensual de ventas.',
            date: new Date(Date.now() - 3600000).toISOString(),
            read: false,
            category: 'task',
            link: '/dashboard/tasks/1',
          },
          {
            id: '2',
            title: 'Actualización de sistema',
            message: 'El sistema se actualizará mañana a las 00:00 horas. Por favor, guarda tu trabajo antes de finalizar el día.',
            date: new Date(Date.now() - 86400000).toISOString(),
            read: false,
            category: 'system',
          },
          {
            id: '3',
            title: 'Nuevo comentario en tu publicación',
            message: 'María ha comentado en tu publicación "Análisis de resultados Q2".',
            date: new Date(Date.now() - 259200000).toISOString(),
            read: true,
            category: 'message',
            link: '/dashboard/comments/123',
          },
          {
            id: '4',
            title: 'Recordatorio de reunión',
            message: 'Tienes una reunión programada para mañana a las 10:00 AM con el equipo de Marketing.',
            date: new Date(Date.now() - 172800000).toISOString(),
            read: true,
            category: 'task',
          },
          {
            id: '5',
            title: 'Mensaje nuevo de Carlos',
            message: 'Hola, ¿podemos revisar juntos los últimos requerimientos del cliente?',
            date: new Date(Date.now() - 432000000).toISOString(),
            read: true,
            category: 'message',
            link: '/dashboard/messages/carlos',
          },
          {
            id: '6',
            title: 'Actualización de seguridad',
            message: 'Hemos implementado nuevas medidas de seguridad. Por favor, verifica tu perfil.',
            date: new Date(Date.now() - 518400000).toISOString(),
            read: true,
            category: 'system',
            link: '/dashboard/profile/security',
          },
          {
            id: '7',
            title: 'Nuevo documento compartido',
            message: 'Laura ha compartido un documento contigo: "Planificación Estratégica 2023".',
            date: new Date(Date.now() - 604800000).toISOString(),
            read: true,
            category: 'message',
            link: '/dashboard/documents/shared/123',
          },
        ];

        setNotifications(mockNotifications);
      } catch (error) {
        console.error('Error al cargar notificaciones:', error);
        toast({
          title: 'Error',
          description: 'No se pudieron cargar las notificaciones',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [toast]);

  // Filtrar notificaciones según la pestaña activa
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.read;
    return notification.category === activeTab;
  });

  // Contar notificaciones por categoría
  const counts = {
    all: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    system: notifications.filter(n => n.category === 'system').length,
    task: notifications.filter(n => n.category === 'task').length,
    message: notifications.filter(n => n.category === 'message').length,
  };

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

      toast({
        title: 'Notificación actualizada',
        description: 'Notificación marcada como leída',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
      toast({
        title: 'Error',
        description: 'No se pudo marcar la notificación como leída',
        variant: 'destructive',
      });
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

      toast({
        title: 'Notificaciones actualizadas',
        description: 'Todas las notificaciones han sido marcadas como leídas',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error al marcar todas las notificaciones como leídas:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron marcar todas las notificaciones como leídas',
        variant: 'destructive',
      });
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "d 'de' MMMM 'a las' HH:mm", { locale: es });
  };

  // Obtener ícono según la categoría
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'system':
        return <Bell className="h-4 w-4 text-blue-500" />;
      case 'task':
        return <CheckCheck className="h-4 w-4 text-green-500" />;
      case 'message':
        return <BellOff className="h-4 w-4 text-amber-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  // Obtener el nombre de la categoría
  const getCategoryName = (category: string) => {
    switch (category) {
      case 'system':
        return 'Sistema';
      case 'task':
        return 'Tareas';
      case 'message':
        return 'Mensajes';
      default:
        return 'Otro';
    }
  };

  return (
    <div className="container py-10">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center text-muted-foreground hover:text-primary mb-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Volver
        </Button>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Notificaciones</h1>
          {counts.unread > 0 && (
            <Button onClick={markAllAsRead} variant="outline" size="sm">
              Marcar todas como leídas
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Centro de notificaciones</CardTitle>
          <CardDescription>
            Administra tus notificaciones y mantente al día con las actualizaciones del sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">
                Todas
                <Badge variant="secondary" className="ml-2">
                  {counts.all}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="unread">
                No leídas
                <Badge variant="secondary" className="ml-2">
                  {counts.unread}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="system">
                Sistema
                <Badge variant="secondary" className="ml-2">
                  {counts.system}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="task">
                Tareas
                <Badge variant="secondary" className="ml-2">
                  {counts.task}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="message">
                Mensajes
                <Badge variant="secondary" className="ml-2">
                  {counts.message}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <p className="text-sm text-muted-foreground">Cargando notificaciones...</p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No hay notificaciones</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activeTab === 'unread'
                      ? 'No tienes notificaciones sin leer.'
                      : 'No hay notificaciones en esta categoría.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => {
                    const NotificationCard = (
                      <Card 
                        key={notification.id} 
                        className={`overflow-hidden transition-colors ${!notification.read ? 'border-primary' : ''}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="mt-1 flex-shrink-0">
                              {getCategoryIcon(notification.category)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-semibold">{notification.title}</h3>
                                <Badge variant="outline" className="ml-2">
                                  {getCategoryName(notification.category)}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>{formatDate(notification.date)}</span>
                                {!notification.read && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-7 text-xs"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      markAsRead(notification.id);
                                    }}
                                  >
                                    Marcar como leída
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );

                    if (notification.link) {
                      return (
                        <Link 
                          href={notification.link} 
                          key={notification.id}
                          onClick={() => !notification.read && markAsRead(notification.id)}
                          className="block"
                        >
                          {NotificationCard}
                        </Link>
                      );
                    }

                    return NotificationCard;
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 