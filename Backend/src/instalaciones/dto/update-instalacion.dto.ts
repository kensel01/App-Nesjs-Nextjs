import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateInstalacionDto } from './create-instalacion.dto';
import { EstadoInstalacion } from '../entities/instalacion.entity';

export class UpdateInstalacionDto extends PartialType(CreateInstalacionDto) {
  @IsOptional()
  @IsEnum(EstadoInstalacion)
  estado?: EstadoInstalacion;
} 