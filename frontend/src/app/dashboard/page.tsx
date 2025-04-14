"use client";

import { useDashboard } from '@/hooks/useDashboard';
import { KPICard } from '@/components/dashboard/KPICard';
import { ServiceDistributionChart } from '@/components/dashboard/ServiceDistributionChart';
import { MonthlyRegistrationsChart } from '@/components/dashboard/MonthlyRegistrationsChart';
import { PagePermissionGuard } from '@/components/auth/PagePermissionGuard';
import { NotificationDemo } from '@/components/dashboard/NotificationDemo';

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboard();

  if (error) {
    return (
      <div className="p-3 sm:p-4 bg-red-50 text-red-600 rounded-lg text-sm sm:text-base">
        Error: {error.message}
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="flex justify-center items-center min-h-[200px] sm:min-h-[400px]">
        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <PagePermissionGuard resource="dashboard" action="read">
      <div className="space-y-4 sm:space-y-6">
        <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <KPICard
            title="Total de Clientes"
            value={data.totalClients}
            trend="up"
            percentage={5}
          />
          <KPICard
            title="Nuevos Clientes (Mes)"
            value={data.newClientsThisMonth}
            trend="up"
            percentage={12}
          />
          <KPICard
            title="Total de Servicios"
            value={data.totalServices}
            trend="neutral"
          />
          <KPICard
            title="Servicios por Cliente"
            value={data.averageServicesPerClient.toFixed(2)}
            description="Promedio"
          />
        </div>

        {/* Notification Demo */}
        <NotificationDemo />

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-2">Distribución de Servicios</h2>
            <div className="h-[300px] sm:h-[350px]">
              <ServiceDistributionChart
                data={data.serviceDistribution}
                className="h-full w-full"
              />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-2">Registros Mensuales</h2>
            <div className="h-[300px] sm:h-[350px]">
              <MonthlyRegistrationsChart
                data={data.monthlyRegistrations}
                className="h-full w-full"
              />
            </div>
          </div>
        </div>

        {/* Payment Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {data.paymentStatuses.map((status) => (
            <KPICard
              key={status.status}
              title={`Pagos ${status.status === 'paid' ? 'Al día' : status.status === 'pending' ? 'Pendientes' : 'Atrasados'}`}
              value={status.count}
              description={`${((status.count / status.total) * 100).toFixed(1)}% del total`}
              trend={status.status === 'paid' ? 'up' : status.status === 'pending' ? 'neutral' : 'down'}
            />
          ))}
        </div>
      </div>
    </PagePermissionGuard>
  );
}   
