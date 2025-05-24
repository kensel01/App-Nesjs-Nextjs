import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Logger } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Apply security headers via Helmet
  app.use(helmet());
  app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true }));
  app.getHttpAdapter().getInstance().disable('x-powered-by');

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Configuración CORS más segura
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',');
  logger.log(`CORS habilitado para: ${allowedOrigins.join(', ')}`);
  
  app.enableCors({
    origin: (origin, callback) => {
      // Permitir solicitudes sin origen (como aplicaciones móviles o curl)
      if (!origin) {
        return callback(null, true);
      }
      
      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      
      logger.warn(`Solicitud CORS bloqueada desde origen: ${origin}`);
      return callback(new Error('No permitido por CORS'), false);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    maxAge: 3600,
  });

  const config = new DocumentBuilder()
    .setTitle('Clientes API')
    .setDescription('API para gestión de clientes de telecomunicaciones')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = parseInt(process.env.PORT) || 8000;
  await app.listen(port);
  logger.log(`Servidor iniciado en puerto ${port}`);
}
bootstrap();
