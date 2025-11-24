import { config } from 'dotenv';
import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { validateEnv } from '../config/env.validation';

// Cargar variables de entorno
config();

// Validar env al cargar el módulo
const env = validateEnv();

@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        level: env.LOG_LEVEL,
        transport:
          env.NODE_ENV === 'development'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  singleLine: true,
                  translateTime: 'SYS:standard',
                },
              }
            : undefined,
        serializers: {
          req: (req: any) => ({
            id: req.id || req.headers?.['x-request-id'],
            method: req.method,
            url: req.url,
          }),
          res: (res: any) => ({
            statusCode: res.statusCode,
          }),
        },
        customProps: (req: any) => ({
          context: 'HTTP',
          requestId: req.id || req.headers?.['x-request-id'],
        }),
      },
    }),
  ],
})
export class LoggerModule {}

