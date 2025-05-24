import { Module } from '@nestjs/common';
import { ClientesModule } from './clientes/clientes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiposDeServicioModule } from './tipos-de-servicio/tipos-de-servicio.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DashboardModule } from './dashboard/dashboard.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Límite global: 300 peticiones por 1 minuto
    ThrottlerModule.forRoot([
      {
        ttl: 60, // tiempo en segundos (1 minuto)
        limit: 300, // número máximo de peticiones en ese periodo
      },
    ]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT) || 5436,
      username: process.env.POSTGRES_USER,
      password: String(process.env.POSTGRES_PASSWORD),
      database: process.env.POSTGRES_DB,
      autoLoadEntities: true,
      // ⚠️ Deshabilitado en producción - usar migraciones en su lugar
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
      ssl: process.env.POSTGRES_SSL === 'true',
      extra: {
        ssl:
          process.env.POSTGRES_SSL === 'true'
            ? {
                rejectUnauthorized: false,
              }
            : null,
      },
      // Configuración para manejo de conexiones
      poolSize: 10, // máximo número de conexiones en el pool
      connectTimeoutMS: 10000, // tiempo de espera para conexiones
    }),
    ClientesModule,
    TiposDeServicioModule,
    UsersModule,
    AuthModule,
    DashboardModule,
    PaymentsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
