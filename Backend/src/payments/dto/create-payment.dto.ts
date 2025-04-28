import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ description: 'Customer ID for the payment' })
  @IsNumber()
  @IsPositive()
  clienteId: number;

  @ApiProperty({ description: 'Service ID for the payment' })
  @IsNumber()
  @IsPositive()
  servicioId: number;

  @ApiProperty({ description: 'Amount to be paid' })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ description: 'Description of the payment' })
  @IsString()
  @IsNotEmpty()
  description: string;
} 