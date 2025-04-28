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

  // Additional methods for getting payment history, etc. could be added here
}
