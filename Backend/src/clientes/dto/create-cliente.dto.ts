import { IsString, IsOptional, IsEmail, IsNotEmpty, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateClienteDto {
  @ApiProperty({ description: 'Nombre completo del cliente' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'RUT del cliente (formato: XX.XXX.XXX-X)' })
  @IsString()
  @IsNotEmpty()
  rut: string;

  @ApiProperty({ description: 'Número de teléfono del cliente' })
  @IsString()
  @IsNotEmpty()
  telefono: string;

  @ApiProperty({
    description: 'Correo electrónico del cliente',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'Dirección del cliente' })
  @IsString()
  @IsNotEmpty()
  direccion: string;

  @ApiProperty({ description: 'Comuna del cliente' })
  @IsString()
  @IsNotEmpty()
  comuna: string;

  @ApiProperty({ description: 'Ciudad o población del cliente' })
  @IsString()
  @IsNotEmpty()
  ciudad: string;

  @ApiProperty({ description: 'Fecha programada para pagos' })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  fechaProgramada: Date;

  @ApiProperty({ 
    description: 'Notas adicionales sobre el cliente (máximo 300 caracteres)',
    required: false,
    maxLength: 300
  })
  @IsString()
  @IsOptional()
  notas?: string;

  @ApiProperty({ description: 'ID del tipo de servicio' })
  @IsNotEmpty()
  tipoDeServicioId: number;
}
