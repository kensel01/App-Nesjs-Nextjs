import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { MercadoPagoService } from './mercadopago.service';
import { WebhookPayloadDto } from './dto/webhook-payload.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/rol.enum';
import { PaymentStatus } from './entities/payment.entity';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly mercadoPagoService: MercadoPagoService,
  ) {}

  @Post('webhook')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Payment webhook endpoint' })
  @ApiBody({ type: WebhookPayloadDto })
  @ApiResponse({ status: 200, description: 'Payment processed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid webhook signature' })
  async processWebhook(@Body() webhookPayload: WebhookPayloadDto) {
    return this.paymentsService.processPaymentWebhook(webhookPayload);
  }

  @Post('mercadopago/webhook')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'MercadoPago webhook endpoint' })
  @ApiResponse({ status: 200, description: 'Payment notification processed successfully' })
  async processMercadoPagoWebhook(@Body() webhookData: any) {
    // Process the webhook notification from MercadoPago
    const processedData = await this.mercadoPagoService.processWebhook(webhookData);
    
    // If the webhook was processed and contains payment data, update our database
    if (processedData.processed && processedData.payload) {
      // Create a webhook payload from the processed data
      const webhookPayload: WebhookPayloadDto = {
        ...processedData.payload,
        status: this.mapToPaymentStatus(processedData.payload.status),
      };
      
      // Process the payment with our payment service
      await this.paymentsService.processPaymentWebhook(webhookPayload);
    }
    
    return { received: true };
  }

  @Get('status/:transactionId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TECNICO, Role.READ_ONLY)
  @ApiOperation({ summary: 'Get payment status by transaction ID' })
  @ApiParam({ name: 'transactionId', description: 'Payment transaction ID' })
  @ApiResponse({
    status: 200,
    description: 'Payment status retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async getPaymentStatus(@Param('transactionId') transactionId: string) {
    return this.paymentsService.checkPaymentStatus(transactionId);
  }

  @Post('create')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TECNICO)
  @ApiOperation({ summary: 'Create a new payment preference with MercadoPago' })
  @ApiBody({ type: CreatePaymentDto })
  @ApiResponse({ status: 201, description: 'Payment preference created successfully' })
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.mercadoPagoService.createPaymentPreference(
      createPaymentDto.clienteId,
      createPaymentDto.servicioId,
      createPaymentDto.amount,
      createPaymentDto.description,
    );
  }

  @Get('mercadopago/status')
  @Public()
  @ApiOperation({ summary: 'Check MercadoPago payment status by external reference' })
  @ApiQuery({ name: 'reference', description: 'External reference (transaction ID)' })
  @ApiResponse({ status: 200, description: 'Payment status retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async getMercadoPagoStatus(@Query('reference') reference: string) {
    const mpStatus = await this.mercadoPagoService.checkPaymentStatus(reference);
    
    // If payment is found and completed/approved, ensure our database is updated
    if (mpStatus.found && (mpStatus.status === 'completed' || mpStatus.status === 'approved')) {
      try {
        // Create a webhook payload from the status data
        const webhookPayload: WebhookPayloadDto = {
          transactionId: reference,
          status: this.mapToPaymentStatus(mpStatus.status),
          amount: mpStatus.amount,
          clienteId: mpStatus.metadata.clienteId,
          servicioId: mpStatus.metadata.servicioId,
          timestamp: new Date().toISOString(),
          signature: '', // This will be ignored in idempotent processing
        };
        
        // Process the payment with our payment service (idempotent operation)
        await this.paymentsService.processPaymentWebhook(webhookPayload);
      } catch (error) {
        // Log error but don't fail the request
        console.error('Error syncing payment status to database:', error);
      }
    }
    
    return mpStatus;
  }

  /**
   * Map string status to PaymentStatus enum
   */
  private mapToPaymentStatus(status: string): PaymentStatus {
    switch (status) {
      case 'completed':
        return PaymentStatus.COMPLETED;
      case 'approved':
        return PaymentStatus.APPROVED;
      case 'rejected':
        return PaymentStatus.REJECTED;
      case 'failed':
        return PaymentStatus.FAILED;
      default:
        return PaymentStatus.PENDING;
    }
  }

  /**
   * Endpoint para generar un token para consulta de clientes
   * Este token se usa como medida de seguridad simple para evitar
   * consultas masivas no autorizadas
   */
  @Post('payment/intent')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate a client query token' })
  async generateClientToken(@Body() data: { rut: string }) {
    // Token simple basado en timestamp y RUT, podría ser más seguro con JWT
    const timestamp = new Date().getTime();
    const token = Buffer.from(`${data.rut}-${timestamp}-${process.env.API_SECRET || 'secret'}`).toString('base64');
    
    return { token };
  }
}
