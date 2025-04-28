import { BaseApiService } from './base-api.service';
import { Payment, PaymentListResponse, PaymentStatus } from '@/types/payment.types';

export class PaymentsService extends BaseApiService {
  private BASE_URL = `${this.API_URL}/payments`;

  constructor(apiUrl?: string) {
    super(apiUrl);
  }

  /**
   * Obtener todos los pagos con paginación y filtros
   */
  async getPayments(
    page = 1,
    limit = 10,
    filters: Record<string, any> = {}
  ): Promise<PaymentListResponse> {
    try {
      const headers = await this.getHeaders();
      const filterParams = this.buildFilterParams(filters);
      const url = `${this.BASE_URL}?page=${page}&limit=${limit}${filterParams}`;

      const response = await this.fetchWithRetry(url, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al obtener pagos');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  }

  /**
   * Obtener un pago por su ID
   */
  async getPaymentById(id: number): Promise<Payment> {
    try {
      const headers = await this.getHeaders();
      const response = await this.fetchWithRetry(`${this.BASE_URL}/${id}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al obtener pago');
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching payment with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Verificar el estado de un pago por ID de transacción
   */
  async checkPaymentStatus(transactionId: string): Promise<{ status: PaymentStatus }> {
    try {
      const headers = await this.getHeaders();
      const response = await this.fetchWithRetry(`${this.BASE_URL}/status/${transactionId}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al verificar estado del pago');
      }

      return await response.json();
    } catch (error) {
      console.error(`Error checking payment status for transaction ${transactionId}:`, error);
      throw error;
    }
  }

  /**
   * Crear un nuevo pago (simulación de pago)
   */
  async createPayment(paymentData: {
    clienteId: number;
    servicioId: number;
    amount: number;
  }): Promise<Payment> {
    try {
      const headers = await this.getHeaders();
      const response = await this.fetchWithRetry(`${this.BASE_URL}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear pago');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }
} 