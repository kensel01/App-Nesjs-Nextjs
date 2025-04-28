import { DashboardData } from '@/types/dashboard.types';
import { getSession } from 'next-auth/react';
import { logger } from '@/lib/logger';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getHeaders = async () => {
  const session = await getSession();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session?.user?.accessToken}`,
  };
};

// Función de espera para backoff exponencial
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const dashboardService = {
  getDashboardData: async (): Promise<DashboardData> => {
    let retries = 3;
    let delay = 1000; // retraso inicial de 1 segundo
    
    while (retries >= 0) {
      try {
        const url = `${API_URL}/api/v1/dashboard`;
        // Reducimos logging innecesario
        // logger.log('Obteniendo datos del dashboard:', url);

        const response = await fetch(url, {
          headers: await getHeaders(),
          // Añadir cache: 'no-store' para evitar caching que podría causar problemas en desarrollo
          cache: 'no-store',
        });

        // Si tenemos un 429 (Too Many Requests), implementamos backoff exponencial
        if (response.status === 429 && retries > 0) {
          logger.warn(`Rate limit alcanzado, esperando ${delay}ms antes de reintentar`);
          await wait(delay);
          delay *= 2; // Duplicar el tiempo de espera en cada reintento
          retries--;
          continue;
        }

        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new Error(error.message || `Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        // Reducimos logging innecesario
        // logger.log('Datos del dashboard recibidos correctamente');
        return data;
      } catch (error) {
        // Si ya no tenemos más reintentos, propagar el error
        if (retries <= 0) {
          logger.error('Error final en getDashboardData después de reintentos:', error);
          throw error;
        }
        
        logger.warn(`Error en getDashboardData, reintentando (${retries} intentos restantes):`, error);
        await wait(delay);
        delay *= 2;
        retries--;
      }
    }
    
    // Este código nunca debería ejecutarse debido al manejo de errores anterior,
    // pero TypeScript necesita un retorno explícito
    throw new Error('No se pudieron obtener los datos del dashboard');
  },
}; 