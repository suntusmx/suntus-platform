import { config } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { validateEnv } from './common/config/env.validation';
import helmet from '@fastify/helmet';
import compress from '@fastify/compress';
import { ZodValidationPipe } from 'nestjs-zod';

// Cargar variables de entorno ANTES de cualquier otra cosa
config();

async function bootstrap() {
  try {
    // Validar variables de entorno al inicio - OBLIGATORIAS
    const env = validateEnv();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: env.NODE_ENV === 'development',
    }),
  );

  // 🛡️ Security: Helmet para headers de seguridad HTTP
  await app.register(helmet, {
    contentSecurityPolicy: env.NODE_ENV === 'production',
  });

  // ⚡ Performance: Compresión gzip/brotli
  await app.register(compress, {
    encodings: ['gzip', 'deflate', 'br'],
  });

  // Configurar CORS
  app.enableCors({
    origin: env.CORS_ORIGIN === '*' ? '*' : env.CORS_ORIGIN.split(','),
    credentials: true,
  });

  // Prefijo global para versionado de API
  app.setGlobalPrefix('api/v1');

  // ✅ Validación global con Zod (recomendación de seguridad)
  app.useGlobalPipes(new ZodValidationPipe());

    await app.listen(env.PORT, '0.0.0.0');
    console.log(`🚀 Application is running on: http://localhost:${env.PORT}/api/v1`);
    console.log(`📊 GraphQL Playground: http://localhost:${env.PORT}/graphql`);
    console.log(`💚 Health check: http://localhost:${env.PORT}/api/v1/health`);
  } catch (error) {
    console.error('❌ Error al iniciar la aplicación:', error);
    if (error instanceof Error) {
      console.error('Mensaje:', error.message);
    }
    process.exit(1);
  }
}
bootstrap();
