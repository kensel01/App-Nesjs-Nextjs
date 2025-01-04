'use client';

import { useState, useEffect } from 'react';
import { DashboardData } from '@/types/dashboard.types';
import { dashboardService } from '@/services/dashboard.service';

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await dashboardService.getDashboardData();
      setData(response);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al obtener datos del dashboard'));
      console.error('Error fetching dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: fetchDashboardData,
  };
} 