'use client';

import { useNotifications } from '@/hooks/useNotifications';
import { notificationService } from '@/services/notification.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Componente de demostración para probar el sistema de notificaciones
 */
export function NotificationDemo() {
  const { showSuccess, showError, showWarning, showInfo } = useNotifications();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sistema de Notificaciones</CardTitle>
        <CardDescription>
          Prueba las diferentes opciones del sistema de notificaciones
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button
          onClick={() =>
            showSuccess('Operación Exitosa', 'La operación se ha realizado correctamente.')
          }
          variant="outline"
          className="bg-green-50 text-green-600 border-green-100 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-900/30"
        >
          Notificación de Éxito
        </Button>
        
        <Button
          onClick={() =>
            showError('Error', 'Se ha producido un error al procesar la solicitud.')
          }
          variant="outline"
          className="bg-red-50 text-red-600 border-red-100 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/30"
        >
          Notificación de Error
        </Button>
        
        <Button
          onClick={() =>
            showWarning('Advertencia', 'Esta acción podría afectar a otros elementos del sistema.')
          }
          variant="outline"
          className="bg-yellow-50 text-yellow-600 border-yellow-100 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800 dark:hover:bg-yellow-900/30"
        >
          Notificación de Advertencia
        </Button>
        
        <Button
          onClick={() =>
            showInfo('Información', 'El sistema se actualizará en los próximos días.')
          }
          variant="outline"
          className="bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/30"
        >
          Notificación de Información
        </Button>
        
        <Button
          onClick={() => notificationService.simulateNewNotification()}
          variant="outline"
        >
          Simulación de Notificación Aleatoria
        </Button>
      </CardContent>
    </Card>
  );
} 