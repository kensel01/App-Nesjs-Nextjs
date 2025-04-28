import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsEnum,
  IsPositive,
  IsDateString,
} from 'class-validator';
import { PaymentStatus } from '../entities/payment.entity';

export class WebhookPayloadDto {
  @ApiProperty({ description: 'Transaction ID for the payment' })
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @ApiProperty({ description: 'Status of the payment', enum: PaymentStatus })
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @ApiProperty({ description: 'Payment amount' })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ description: 'Customer ID associated with the payment' })
  @IsNumber()
  @IsPositive()
  clienteId: number;

  @ApiProperty({ description: 'Service ID associated with the payment' })
  @IsNumber()
  @IsPositive()
  servicioId: number;

  @ApiProperty({ description: 'Timestamp of the payment notification' })
  @IsDateString()
  timestamp: string;

  @ApiProperty({ description: 'Signature for verifying the webhook payload' })
  @IsString()
  @IsNotEmpty()
  signature: string;
}
