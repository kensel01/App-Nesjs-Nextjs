import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiposDeServicioService } from './tipos-de-servicio.service';
import { TiposDeServicioController } from './tipos-de-servicio.controller';
import { TipoDeServicio } from './entities/tipo-de-servicio.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([TipoDeServicio]), AuthModule],
  controllers: [TiposDeServicioController],
  providers: [TiposDeServicioService],
  exports: [TiposDeServicioService],
})
export class TiposDeServicioModule {} 