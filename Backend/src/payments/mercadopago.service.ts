import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// Importar las clases de la nueva versión del SDK
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

@Injectable()
export class MercadoPagoService {
  private readonly logger = new Logger(MercadoPagoService.name);
  private client: MercadoPagoConfig;
  private preferenceClient: Preference;
  private paymentClient: Payment;

  constructor(private configService: ConfigService) {
    // Initialize MercadoPago with access token from environment variables
    const accessToken = this.configService.get<string>('MERCADOPAGO_ACCESS_TOKEN');
    
    if (!accessToken) {
      this.logger.error('MERCADOPAGO_ACCESS_TOKEN not set in environment variables');
      throw new Error('MercadoPago access token is required');
    }
    
    // Configure SDK with the access token usando nueva sintaxis
    this.client = new MercadoPagoConfig({ 
      accessToken: accessToken 
    });
    
    // Inicializar los clientes específicos
    this.preferenceClient = new Preference(this.client);
    this.paymentClient = new Payment(this.client);
  }

  /**
   * Create a payment preference in MercadoPago
   * @param clienteId - Customer ID
   * @param servicioId - Service ID
   * @param amount - Payment amount
   * @param description - Payment description
   * @returns Promise with payment URL and preference ID
   */
  async createPaymentPreference(
    clienteId: number,
    servicioId: number,
    amount: number,
    description: string,
  ) {
    try {
      const baseUrl = this.configService.get<string>('APP_URL');
      const notificationUrl = `${baseUrl}/api/payments/mercadopago/webhook`;
      
      // Create preference with MercadoPago SDK
      const preferenceData = {
        items: [
          {
            id: `srv-${servicioId}`,
            title: description,
            quantity: 1,
            unit_price: amount,
            currency_id: 'CLP',
          },
        ],
        external_reference: `cli-${clienteId}-srv-${servicioId}-${Date.now()}`, // Use this as transactionId
        back_urls: {
          success: `${baseUrl}/payment/success`,
          failure: `${baseUrl}/payment/failure`,
          pending: `${baseUrl}/payment/pending`,
        },
        notification_url: notificationUrl,
        auto_return: 'approved',
        metadata: {
          clienteId,
          servicioId,
        },
      };

      const response = await this.preferenceClient.create({ body: preferenceData });
      
      this.logger.log(`Payment preference created: ${response.id}`);
      
      return {
        preferenceId: response.id,
        initPoint: response.init_point, // Web checkout URL
        sandboxInitPoint: response.sandbox_init_point, // Testing URL
        transactionId: preferenceData.external_reference,
      };
    } catch (error) {
      this.logger.error(`Error creating payment preference: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Process a webhook notification from MercadoPago
   * @param data - The webhook payload
   * @returns Processed payment data
   */
  async processWebhook(data: any) {
    try {
      if (data.type !== 'payment') {
        this.logger.log(`Ignoring non-payment notification: ${data.type}`);
        return { processed: false, message: 'Not a payment notification' };
      }

      // Fetch payment details using MercadoPago SDK
      const paymentId = data.data.id;
      
      const payment = await this.paymentClient.get({ id: paymentId });
      
      if (!payment) {
        throw new Error(`Invalid payment data for ID: ${paymentId}`);
      }

      const paymentData = payment;
      const externalReference = paymentData.external_reference;
      const status = this.mapPaymentStatus(paymentData.status);
      
      // Extract metadata
      const metadata = paymentData.metadata || {};
      const clienteId = metadata.clienteId || this.extractClienteIdFromReference(externalReference);
      const servicioId = metadata.servicioId || this.extractServicioIdFromReference(externalReference);
      
      // Calculate signature for webhook verification
      const payloadString = JSON.stringify({
        transactionId: externalReference,
        status,
        amount: paymentData.transaction_amount,
        clienteId,
        servicioId,
      });
      
      const webhookSecretKey = this.configService.get<string>('PAYMENT_WEBHOOK_SECRET');
      const signature = this.generateSignature(payloadString, webhookSecretKey);
      
      return {
        processed: true,
        payload: {
          transactionId: externalReference,
          status,
          amount: paymentData.transaction_amount,
          clienteId,
          servicioId,
          timestamp: new Date().toISOString(),
          signature,
        },
      };
    } catch (error) {
      this.logger.error(`Error processing webhook: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Check the status of a payment by reference
   * @param externalReference - The external reference (transaction ID)
   * @returns Payment status information
   */
  async checkPaymentStatus(externalReference: string) {
    try {
      // Search for payments by external reference usando la nueva sintaxis
      const searchResponse = await this.paymentClient.search({ 
        options: { 
          qs: `external_reference=${externalReference}` 
        } 
      });
      
      if (!searchResponse.paging.total || searchResponse.results.length === 0) {
        return {
          found: false,
          status: 'not_found',
          message: `No payment found for reference: ${externalReference}`,
        };
      }
      
      // Get the most recent payment (in case there are multiple)
      const payment = searchResponse.results[0];
      
      // Extract metadata
      const metadata = payment.metadata || {};
      const clienteId = metadata.clienteId || this.extractClienteIdFromReference(externalReference);
      const servicioId = metadata.servicioId || this.extractServicioIdFromReference(externalReference);
      
      return {
        found: true,
        paymentId: payment.id,
        status: this.mapPaymentStatus(payment.status),
        amount: payment.transaction_amount,
        date: payment.date_created,
        metadata: {
          clienteId,
          servicioId,
        },
      };
    } catch (error) {
      this.logger.error(`Error checking payment status: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Map MercadoPago payment status to our internal status
   */
  private mapPaymentStatus(mpStatus: string): string {
    const statusMap = {
      approved: 'completed',
      authorized: 'approved',
      in_process: 'pending',
      in_mediation: 'pending',
      rejected: 'rejected',
      cancelled: 'rejected',
      refunded: 'rejected',
      charged_back: 'rejected',
    };
    
    return statusMap[mpStatus] || 'pending';
  }

  /**
   * Extract cliente ID from external reference
   */
  private extractClienteIdFromReference(reference: string): number {
    try {
      // Format: cli-{clienteId}-srv-{servicioId}-{timestamp}
      const match = reference.match(/cli-(\d+)-srv-/);
      return match ? parseInt(match[1], 10) : 0;
    } catch (error) {
      this.logger.error(`Error extracting clienteId: ${error.message}`);
      return 0;
    }
  }

  /**
   * Extract servicio ID from external reference
   */
  private extractServicioIdFromReference(reference: string): number {
    try {
      // Format: cli-{clienteId}-srv-{servicioId}-{timestamp}
      const match = reference.match(/srv-(\d+)-/);
      return match ? parseInt(match[1], 10) : 0;
    } catch (error) {
      this.logger.error(`Error extracting servicioId: ${error.message}`);
      return 0;
    }
  }

  /**
   * Generate HMAC signature for webhook verification
   */
  private generateSignature(payload: string, secret: string): string {
    const crypto = require('crypto');
    return crypto.createHmac('sha256', secret).update(payload).digest('hex');
  }
} 