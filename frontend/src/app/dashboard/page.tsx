"use client";

import { useDashboard } from '@/hooks/useDashboard';
import { KPICard } from '@/components/dashboard/KPICard';
import { ServiceDistributionChart } from '@/components/dashboard/ServiceDistributionChart';
import { MonthlyRegistrationsChart } from '@/components/dashboard/MonthlyRegistrationsChart';
import { PagePermissionGuard } from '@/components/auth/PagePermissionGuard';

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboard();

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        Error: {error.message}
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <PagePermissionGuard resource="dashboard" action="read">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total de Clientes"
            value={data.totalClients}
            trend="up"
            percentage={5}
          />
          <KPICard
            title="Nuevos Clientes (Este Mes)"
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
            title="Promedio de Servicios por Cliente"
            value={data.averageServicesPerClient.toFixed(2)}
            description="Servicios/Cliente"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ServiceDistributionChart
            data={data.serviceDistribution}
            className="min-h-[400px]"
          />
          <MonthlyRegistrationsChart
            data={data.monthlyRegistrations}
            className="min-h-[400px]"
          />
        </div>

        {/* Payment Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
