import { useCallback } from 'react';
import { useNotificationStore, NotificationType } from '@/store/notification';

/**
 * Hook personalizado para manejar notificaciones en la aplicación
 * 
 * @returns Funciones para mostrar diferentes tipos de notificaciones
 */
export function useNotifications() {
  const addNotification = useNotificationStore((state) => state.addNotification);

  const showNotification = useCallback(
    (title: string, message: string, type: NotificationType = 'default', link?: string) => {
      addNotification({
        title,
        message,
        type,
        link,
      });
    },
    [addNotification]
  );

  const showSuccess = useCallback(
    (title: string, message: string, link?: string) => {
      showNotification(title, message, 'success', link);
    },
    [showNotification]
  );

  const showError = useCallback(
    (title: string, message: string, link?: string) => {
      showNotification(title, message, 'destructive', link);
    },
    [showNotification]
  );

  const showWarning = useCallback(
    (title: string, message: string, link?: string) => {
      showNotification(title, message, 'warning', link);
    },
    [showNotification]
  );

  const showInfo = useCallback(
    (title: string, message: string, link?: string) => {
      showNotification(title, message, 'default', link);
    },
    [showNotification]
  );

  return {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
} 