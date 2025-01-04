import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, Between } from 'typeorm';
import { Cliente } from '../clientes/entities/cliente.entity';
import { TipoDeServicio } from '../tipos-de-servicio/entities/tipo-de-servicio.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(TipoDeServicio)
    private readonly tipoDeServicioRepository: Repository<TipoDeServicio>,
  ) {}

  async getDashboardData() {
    const [clientes, totalClientes] = await this.clienteRepository.findAndCount();
    const [servicios, totalServicios] = await this.tipoDeServicioRepository.findAndCount();

    // Calcular clientes nuevos este mes
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const newClientsThisMonth = await this.clienteRepository.count({
      where: {
        createdAt: MoreThanOrEqual(startOfMonth),
      },
    });

    // Calcular distribución de servicios
    const serviceDistribution = await Promise.all(
      servicios.map(async (servicio) => {
        const count = await this.clienteRepository.count({
          where: {
            tipoDeServicio: { id: servicio.id },
          },
        });

        return {
          name: servicio.name,
          value: count,
          color: this.getRandomColor(),
        };
      })
    );

    // Calcular registros mensuales (últimos 6 meses)
    const monthlyRegistrations = await this.getMonthlyRegistrations();

    // Simular estados de pago (esto deberá conectarse con la pasarela de pagos)
    const paymentStatuses = [
      { status: 'paid', count: Math.floor(totalClientes * 0.7), total: totalClientes },
      { status: 'pending', count: Math.floor(totalClientes * 0.2), total: totalClientes },
      { status: 'overdue', count: Math.floor(totalClientes * 0.1), total: totalClientes },
    ];

    return {
      totalClients: totalClientes,
      newClientsThisMonth,
      totalServices: totalServicios,
      averageServicesPerClient: totalClientes > 0 ? totalServicios / totalClientes : 0,
      paymentStatuses,
      serviceDistribution,
      monthlyRegistrations,
    };
  }

  private async getMonthlyRegistrations() {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const count = await this.clienteRepository.count({
        where: {
          createdAt: Between(startOfMonth, endOfMonth),
        },
      });

      months.push({
        month: date.toLocaleString('es', { month: 'short' }),
        count,
      });
    }
    return months;
  }

  private getRandomColor() {
    const colors = [
      '#3b82f6', // blue
      '#10b981', // green
      '#f59e0b', // yellow
      '#ef4444', // red
      '#8b5cf6', // purple
      '#ec4899', // pink
      '#6366f1', // indigo
      '#14b8a6', // teal
      '#f97316', // orange
      '#06b6d4', // cyan
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
} 