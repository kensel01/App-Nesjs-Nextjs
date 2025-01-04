export interface KPICard {
  title: string;
  value: number | string;
  trend?: 'up' | 'down' | 'neutral';
  percentage?: number;
  description?: string;
}

export interface ServiceDistribution {
  name: string;
  value: number;
  color: string;
}

export interface MonthlyRegistration {
  month: string;
  count: number;
}

export interface PaymentStatus {
  status: 'pending' | 'paid' | 'overdue';
  count: number;
  total: number;
}

export interface DashboardData {
  totalClients: number;
  newClientsThisMonth: number;
  totalServices: number;
  averageServicesPerClient: number;
  paymentStatuses: PaymentStatus[];
  serviceDistribution: ServiceDistribution[];
  monthlyRegistrations: MonthlyRegistration[];
} 