import { IsOptional, IsEnum, IsDateString, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { EstadoInstalacion } from '../entities/instalacion.entity';

export class FilterInstalacionDto {
  @IsOptional()
  @IsEnum(EstadoInstalacion, { each: true })
  estados?: EstadoInstalacion[];

  @IsOptional()
  @IsDateString()
  fechaDesde?: string;

  @IsOptional()
  @IsDateString()
  fechaHasta?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  clienteId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  clienteServicioId?: number;

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
  busqueda?: string;
} 