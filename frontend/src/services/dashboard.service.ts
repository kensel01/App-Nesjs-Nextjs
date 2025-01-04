import { DashboardData } from '@/types/dashboard.types';
import { getSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getHeaders = async () => {
  const session = await getSession();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session?.user?.accessToken}`,
  };
};

export const dashboardService = {
  getDashboardData: async (): Promise<DashboardData> => {
    try {
      const url = `${API_URL}/api/v1/dashboard`;
      console.log('URL de la petición:', url);

      const response = await fetch(url, {
        headers: await getHeaders(),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Error al obtener datos del dashboard');
      }

      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      return data;
    } catch (error) {
      console.error('Error en getDashboardData:', error);
      throw error;
    }
  },
}; 