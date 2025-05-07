import { IsNotEmpty, IsOptional, IsEnum, IsDate, IsString, IsNumber, IsDateString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { EstadoInstalacion } from '../entities/instalacion.entity';

export class CreateInstalacionDto {
  @IsEnum(EstadoInstalacion)
  @IsOptional()
  estado?: EstadoInstalacion;

  @IsNotEmpty()
  @IsDateString()
  fechaProgramada: string;

  @IsOptional()
  @IsString()
  horaInicio?: string;

  @IsOptional()
  @IsString()
  horaFin?: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  clienteServicioId: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  clienteId: number;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  comuna?: string;

  @IsOptional()
  @IsString()
  ciudad?: string;

  @IsOptional()
  @IsString()
  nombreTecnico?: string;

  @IsOptional()
  @IsString()
  telefonoTecnico?: string;

  @IsOptional()
  @IsString()
  notas?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
} 