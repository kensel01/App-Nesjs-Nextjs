import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { WebhookPayloadDto } from './dto/webhook-payload.dto';
import { Cliente } from '../clientes/entities/cliente.entity';
import { TipoDeServicio } from '../tipos-de-servicio/entities/tipo-de-servicio.entity';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly webhookSecretKey: string;

  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @InjectRepository(Cliente)
    private clientesRepository: Repository<Cliente>,
    @InjectRepository(TipoDeServicio)
    private tiposDeServicioRepository: Repository<TipoDeServicio>,
    private configService: ConfigService,
    private dataSource: DataSource,
  ) {
    this.webhookSecretKey = this.configService.get<string>(
      'PAYMENT_WEBHOOK_SECRET',
    );
    if (!this.webhookSecretKey) {
      this.logger.warn(
        'PAYMENT_WEBHOOK_SECRET not set. Webhook signature verification will be skipped.',
      );
    }
  }

  async processPaymentWebhook(
    webhookPayload: WebhookPayloadDto,
  ): Promise<Payment> {
    // Verify webhook signature
    this.verifyWebhookSignature(webhookPayload);

    // Process payment with transaction
    return this.processPaymentWithTransaction(webhookPayload);
  }

  async checkPaymentStatus(transactionId: string): Promise<any> {
    this.logger.log(
      `Checking payment status for transaction: ${transactionId}`,
    );

    // First check local database
    const payment = await this.paymentsRepository.findOne({
      where: { transactionId },
      relations: ['cliente', 'servicio'],
    });

    if (payment) {
      return {
        status: payment.status,
        amount: payment.amount,
        processedAt: payment.processedAt,
        clienteId: payment.cliente.id,
        servicioId: payment.servicio.id,
      };
    }

    // If not found locally, query the payment gateway
    try {
      // Here you would integrate with your payment gateway
      // This is a placeholder for the actual implementation
      const gatewayStatus = {
        status: PaymentStatus.PENDING,
        amount: 0,
        metadata: {
          clienteId: 0,
          servicioId: 0,
        },
      };

      /* 
      const gatewayStatus = await this.paymentGatewayService.checkTransactionStatus(transactionId);
      */

      // If found in gateway but not in our DB, it might be a transaction that
      // didn't trigger the webhook properly, so we should process it now
      if (
        gatewayStatus.status === PaymentStatus.COMPLETED ||
        gatewayStatus.status === PaymentStatus.APPROVED
      ) {
        // Process the payment as if webhook had been received
        await this.processPaymentWebhook({
          transactionId,
          status: gatewayStatus.status as PaymentStatus,
          amount: gatewayStatus.amount,
          clienteId: gatewayStatus.metadata.clienteId,
          servicioId: gatewayStatus.metadata.servicioId,
          signature: '', // This would need to be properly generated for a real implementation
          timestamp: new Date().toISOString() // Añade esta línea para solucionar el error
        });

        // Now fetch the newly created payment
        const newPayment = await this.paymentsRepository.findOne({
          where: { transactionId },
          relations: ['cliente', 'servicio'],
        });

        if (newPayment) {
          return {
            status: newPayment.status,
            amount: newPayment.amount,
            processedAt: newPayment.processedAt,
            clienteId: newPayment.cliente.id,
            servicioId: newPayment.servicio.id,
          };
        }
      }

      return gatewayStatus;
    } catch (error) {
      this.logger.error(
        `Failed to check payment status: ${error.message}`,
        error.stack,
      );
      throw new NotFoundException(
        `Payment with transaction ID ${transactionId} not found`,
      );
    }
  }

  private verifyWebhookSignature(payload: WebhookPayloadDto): void {
    if (!this.webhookSecretKey) {
      this.logger.warn(
        'Skipping webhook signature verification as no secret key is configured',
      );
      return;
    }

    const { signature, ...payloadWithoutSignature } = payload;

    // Create a string from payload in a deterministic way (same order of fields)
    const payloadString = JSON.stringify(
      Object.keys(payloadWithoutSignature)
        .sort()
        .reduce((result, key) => {
          result[key] = payloadWithoutSignature[key];
          return result;
        }, {}),
    );

    // Calculate expected HMAC
    const expectedSignature = crypto
      .createHmac('sha256', this.webhookSecretKey)
      .update(payloadString)
      .digest('hex');

    // Check if signatures match
    if (signature !== expectedSignature) {
      this.logger.error(
        `Invalid webhook signature for transaction ${payload.transactionId}`,
      );
      throw new UnauthorizedException('Invalid webhook signature');
    }

    this.logger.log(
      `Verified webhook signature for transaction ${payload.transactionId}`,
    );
  }

  private async processPaymentWithTransaction(
    payload: WebhookPayloadDto,
  ): Promise<Payment> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Get repositories from transaction manager
      const paymentRepo = queryRunner.manager.getRepository(Payment);
      const clienteRepo = queryRunner.manager.getRepository(Cliente);
      const servicioRepo = queryRunner.manager.getRepository(TipoDeServicio);

      // Check if payment already exists to avoid duplicates
      const existingPayment = await paymentRepo.findOne({
        where: { transactionId: payload.transactionId },
      });

      if (existingPayment) {
        this.logger.warn(
          `Payment with transaction ID ${payload.transactionId} already exists.`,
        );
        await queryRunner.release();
        return existingPayment;
      }

      // Find cliente and service
      const cliente = await clienteRepo.findOne({
        where: { id: payload.clienteId },
      });

      const servicio = await servicioRepo.findOne({
        where: { id: payload.servicioId },
      });

      if (!cliente || !servicio) {
        throw new Error(
          `Cliente or servicio not found for payment: ${payload.transactionId}`,
        );
      }

      // Create new payment
      const payment = paymentRepo.create({
        transactionId: payload.transactionId,
        amount: payload.amount,
        status: payload.status,
        processedAt: new Date(),
        cliente,
        clienteId: cliente.id,
        servicio,
        servicioId: servicio.id,
      });

      await paymentRepo.save(payment);

      // Update service status if payment is completed
      // Here you would need to implement the logic to update the service status
      // This would be specific to your application's business logic

      // Commit transaction
      await queryRunner.commitTransaction();
      this.logger.log(
        `Successfully processed payment: ${payload.transactionId}`,
      );

      return payment;
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `Failed to process payment: ${error.message}`,
        error.stack,
      );
      throw error;
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }

  /**
   * Obtiene el último pago registrado para un cliente y servicio específico
   * @param clienteId ID del cliente
   * @param servicioId ID del servicio
   * @returns El último pago o null si no hay pagos
   */
  async getUltimoPago(clienteId: number, servicioId: number): Promise<{ 
    id: number; 
    fecha: Date; 
    monto: number; 
    estado: string;
  } | null> {
    try {
      const pago = await this.paymentsRepository
        .createQueryBuilder('payment')
        .where('payment.clienteId = :clienteId', { clienteId })
        .andWhere('payment.servicioId = :servicioId', { servicioId })
        .andWhere('payment.status IN (:...estados)', { 
          estados: ['COMPLETED', 'APPROVED'] 
        })
        .orderBy('payment.createdAt', 'DESC')
        .getOne();
        
      if (!pago) {
        return null;
      }
      
      return {
        id: pago.id,
        fecha: pago.createdAt,
        monto: pago.amount,
        estado: pago.status
      };
      
    } catch (error) {
      this.logger.error(`Error obteniendo último pago: ${error.message}`);
      return null;
    }
  }

  /**
   * Obtiene una lista de los pagos más recientes para un cliente y servicio específico
   * @param clienteId ID del cliente
   * @param servicioId ID del servicio
   * @param limit Número máximo de pagos a obtener
   * @returns Lista de pagos recientes
   */
  async getPagosRecientes(
    clienteId: number, 
    servicioId: number,
    limit: number = 3
  ): Promise<Array<{
    id: number;
    fecha: Date;
    monto: number;
    estado: string;
    metodoPago: string;
  }>> {
    try {
      this.logger.debug(`Buscando los últimos ${limit} pagos para cliente ${clienteId} y servicio ${servicioId}`);
      
      const pagos = await this.paymentsRepository.find({
        where: { 
          clienteId, 
          servicioId 
        },
        order: { 
          processedAt: 'DESC' 
        },
        take: limit
      });
      
      // Si no hay pagos, devolver array vacío
      if (!pagos || pagos.length === 0) {
        return [];
      }
      
      // Mapear a la estructura esperada
      return pagos.map(pago => ({
        id: pago.id,
        fecha: pago.processedAt,
        monto: pago.amount,
        estado: pago.status,
        metodoPago: this.obtenerMetodoPago(pago)
      }));
    } catch (error) {
      this.logger.error(`Error obteniendo pagos recientes: ${error.message}`, error.stack);
      return [];
    }
  }

  /**
   * Obtiene una descripción amigable del método de pago
   * @param pago Objeto Payment
   * @returns Descripción del método de pago
   */
  private obtenerMetodoPago(pago: Payment): string {
    // En una implementación real, esto podría obtenerse de metadatos del pago
    // Por ahora usamos un valor predeterminado
    return 'Tarjeta de crédito/débito';
  }

  // Additional methods for getting payment history, etc. could be added here
}
