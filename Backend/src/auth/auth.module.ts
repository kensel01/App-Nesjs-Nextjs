import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstans } from './constants/jwt.constants';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PasswordController } from './password.controller';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    ThrottlerModule.forRoot([{
      name: 'auth',
      ttl: 60000, // 1 minuto
      limit: 5,   // 5 intentos por minuto
    }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '1d',
        },
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [AuthController, PasswordController],
  providers: [AuthService],
  exports: [JwtModule],
})
export class AuthModule {}
