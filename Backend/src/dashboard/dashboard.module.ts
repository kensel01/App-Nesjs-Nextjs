import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Cliente } from '../clientes/entities/cliente.entity';
import { TipoDeServicio } from '../tipos-de-servicio/entities/tipo-de-servicio.entity';
import { AuthModule } from '../auth/auth.module';
import { Payment } from '../payments/entities/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cliente, TipoDeServicio, Payment]),
    AuthModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
