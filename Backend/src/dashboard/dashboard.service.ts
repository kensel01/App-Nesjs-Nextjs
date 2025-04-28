import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, Between } from 'typeorm';
import { Cliente } from '../clientes/entities/cliente.entity';
import { TipoDeServicio } from '../tipos-de-servicio/entities/tipo-de-servicio.entity';
import { Payment, PaymentStatus } from '../payments/entities/payment.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(TipoDeServicio)
    private readonly tipoDeServicioRepository: Repository<TipoDeServicio>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async getDashboardData() {
    try {
      // Ejecutar consultas en paralelo para mejorar el rendimiento
      const [
        clientesResult,
        serviciosResult,
        newClientsThisMonth,
        paymentStatuses
      ] = await Promise.all([
        this.clienteRepository.findAndCount(),
        this.tipoDeServicioRepository.findAndCount(),
        this.getNewClientsThisMonth(),
        this.getPaymentStatuses()
      ]);

      const [clientes, totalClientes] = clientesResult;
      const [servicios, totalServicios] = serviciosResult;

      // Obtener distribución de servicios de manera optimizada 
      const serviceDistribution = await this.getServiceDistribution(servicios);

      // Obtener registros mensuales (últimos 6 meses)
      const monthlyRegistrations = await this.getMonthlyRegistrations();

      return {
        totalClients: totalClientes,
        newClientsThisMonth,
        totalServices: totalServicios,
        averageServicesPerClient:
          totalClientes > 0 ? totalServicios / totalClientes : 0,
        paymentStatuses,
        serviceDistribution,
        monthlyRegistrations,
      };
    } catch (error) {
      this.logger.error(`Error obteniendo dashboard data: ${error.message}`, error.stack);
      throw error;
    }
  }

  // Método separado para obtener clientes nuevos del mes
  private async getNewClientsThisMonth() {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    return this.clienteRepository.count({
      where: {
        createdAt: MoreThanOrEqual(startOfMonth),
      },
    });
  }

  // Método optimizado para obtener distribución de servicios
  private async getServiceDistribution(servicios: TipoDeServicio[]) {
    // Obtener recuentos en una sola consulta usando el agrupamiento
    const serviceCounts = await this.clienteRepository
      .createQueryBuilder('cliente')
      .select('cliente.tipoDeServicioId')
      .addSelect('COUNT(*)', 'count')
      .groupBy('cliente.tipoDeServicioId')
      .getRawMany();

    // Crear un mapa para fácil acceso
    const serviceCountMap = serviceCounts.reduce((map, item) => {
      map[item.tipoDeServicioId] = parseInt(item.count);
      return map;
    }, {});

    // Formato requerido para el frontend
    return servicios.map(servicio => ({
      name: servicio.name,
      value: serviceCountMap[servicio.id] || 0,
      color: this.getRandomColor(),
    }));
  }

  async getActiveCustomers(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    this.logger.log(
      `Fetching active customers with pagination: page ${page}, limit ${limit}`,
    );

    // Obtenemos los clientes con pagos al día
    // Esta es una implementación provisional, se debe ajustar según la lógica específica
    // de "cliente activo" en el contexto de la aplicación
    const query = this.clienteRepository
      .createQueryBuilder('cliente')
      .leftJoin('cliente.payments', 'payment')
      .where('payment.status IN (:...statuses)', {
        statuses: [PaymentStatus.COMPLETED, PaymentStatus.APPROVED],
      })
      .orderBy('cliente.name', 'ASC')
      .skip(skip)
      .take(limit);

    const [clientes, total] = await query.getManyAndCount();

    return {
      data: clientes,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getSuspendedCustomers(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    this.logger.log(
      `Fetching suspended customers with pagination: page ${page}, limit ${limit}`,
    );

    // Esta es una implementación provisional, asumiendo que un cliente está
    // suspendido si no tiene pagos COMPLETED o APPROVED
    // Se debe ajustar según la lógica específica del negocio
    const query = this.clienteRepository
      .createQueryBuilder('cliente')
      .leftJoin('cliente.payments', 'payment')
      .where('payment.id IS NULL OR payment.status NOT IN (:...statuses)', {
        statuses: [PaymentStatus.COMPLETED, PaymentStatus.APPROVED],
      })
      .orderBy('cliente.name', 'ASC')
      .skip(skip)
      .take(limit);

    const [clientes, total] = await query.getManyAndCount();

    return {
      data: clientes,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPaymentSummary() {
    // Obtener resumen de pagos para el dashboard de administrador
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const lastMonth = new Date(currentMonth);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    // Pagos del mes actual
    const currentMonthPayments = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'total')
      .where('payment.createdAt >= :start', { start: currentMonth })
      .andWhere('payment.status IN (:...statuses)', {
        statuses: [PaymentStatus.COMPLETED, PaymentStatus.APPROVED],
      })
      .getRawOne();

    // Pagos del mes anterior
    const lastMonthPayments = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'total')
      .where('payment.createdAt >= :start AND payment.createdAt < :end', {
        start: lastMonth,
        end: currentMonth,
      })
      .andWhere('payment.status IN (:...statuses)', {
        statuses: [PaymentStatus.COMPLETED, PaymentStatus.APPROVED],
      })
      .getRawOne();

    // Distribución de estados de pago
    const paymentStatusDistribution = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('payment.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('payment.status')
      .getRawMany();

    // Últimos 5 pagos para mostrarlos en un panel
    const latestPayments = await this.paymentRepository.find({
      relations: ['cliente', 'servicio'],
      order: { createdAt: 'DESC' },
      take: 5,
    });

    return {
      currentMonthTotal: Number(currentMonthPayments?.total || 0),
      lastMonthTotal: Number(lastMonthPayments?.total || 0),
      percentChange:
        lastMonthPayments?.total > 0
          ? ((Number(currentMonthPayments?.total || 0) -
              Number(lastMonthPayments?.total || 0)) /
              Number(lastMonthPayments?.total || 1)) *
            100
          : 0,
      statusDistribution: paymentStatusDistribution,
      latestPayments: latestPayments.map((payment) => ({
        id: payment.id,
        amount: payment.amount,
        status: payment.status,
        date: payment.createdAt,
        clientName: payment.cliente?.name || 'Cliente no encontrado',
        serviceName: payment.servicio?.name || 'Servicio no encontrado',
      })),
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

  private async getPaymentStatuses() {
    // Obtener conteo real de pagos por estado
    const paymentStats = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('payment.status', 'status')
      .addSelect('COUNT(payment.id)', 'count')
      .groupBy('payment.status')
      .getRawMany();

    // Mapear a formato requerido
    const totalPayments = paymentStats.reduce(
      (sum, stat) => sum + parseInt(stat.count),
      0,
    );

    return paymentStats.map((stat) => ({
      status: stat.status,
      count: parseInt(stat.count),
      total: totalPayments,
    }));
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
