import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import { Cliente } from './entities/cliente.entity';
import { TiposDeServicioModule } from '../tipos-de-servicio/tipos-de-servicio.module';
import { ClienteServicio } from './entities/cliente-servicio.entity';
import { PaymentsModule } from '../payments/payments.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cliente, ClienteServicio]),
    TiposDeServicioModule,
    PaymentsModule,
    AuthModule,
  ],
  controllers: [ClientesController],
  providers: [ClientesService],
  exports: [ClientesService],
})
export class ClientesModule {}
