import { useNotificationStore } from '@/store/notification';

/**
 * Servicio de notificaciones para gestionar la comunicación
 * con el backend y mostrar notificaciones al usuario
 */
export const notificationService = {
  /**
   * Procesa las notificaciones recibidas del servidor
   * @param notifications Lista de notificaciones recibidas desde el servidor
   */
  processServerNotifications: (
    notifications: Array<{
      id: string;
      title: string;
      message: string;
      type: 'default' | 'success' | 'destructive' | 'warning';
      link?: string;
    }>
  ) => {
    const { addNotification } = useNotificationStore.getState();
    
    notifications.forEach((notification) => {
      addNotification({
        title: notification.title,
        message: notification.message,
        type: notification.type,
        link: notification.link,
      });
    });
  },

  /**
   * Simula la llegada de una nueva notificación para pruebas
   * @param delay Tiempo de espera antes de mostrar la notificación (en ms)
   */
  simulateNewNotification: (delay = 0) => {
    const types = ['default', 'success', 'destructive', 'warning'] as const;
    const titles = [
      'Nuevo cliente registrado',
      'Pago recibido',
      'Error en el sistema',
      'Actualización disponible',
      'Servicio programado',
    ];
    const messages = [
      'Se ha registrado un nuevo cliente en el sistema.',
      'Se ha recibido un pago por el servicio #1234.',
      'Ha ocurrido un error en el sistema. Por favor, contacte al administrador.',
      'Hay una nueva actualización disponible para el sistema.',
      'Se ha programado un nuevo servicio para el cliente Juan Pérez.',
    ];

    setTimeout(() => {
      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomTitle = titles[Math.floor(Math.random() * titles.length)];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];

      const { addNotification } = useNotificationStore.getState();
      addNotification({
        title: randomTitle,
        message: randomMessage,
        type: randomType,
        link: randomType === 'success' ? '/dashboard/clientes' : undefined,
      });
    }, delay);
  },
}; 