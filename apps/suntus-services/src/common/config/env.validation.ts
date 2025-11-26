import { z } from 'zod';

const envSchema = z.object({
  // Core
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().transform(Number),
  DATABASE_URL: z.string().url('Invalid DATABASE_URL'),
  CORS_ORIGIN: z.string(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']),
  // JWT interno (OBLIGATORIAS - seguridad crítica)
  JWT_SECRET: z.string().min(32, 'JWT_SECRET debe tener al menos 32 caracteres'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET debe tener al menos 32 caracteres'),
  JWT_EXPIRES_IN: z.string(), // Ej: '15m', '1h', '24h'
  JWT_REFRESH_EXPIRES_IN: z.string(), // Ej: '7d', '30d'
  // Auth0 (OBLIGATORIAS para usuarios/expertos)
  AUTH0_DOMAIN: z.string().min(1, 'AUTH0_DOMAIN is required'), // Ej: dev-vbm4nnv0ggzbfugj.us.auth0.com (no es URL completa)
  AUTH0_AUDIENCE: z.string(),
  AUTH0_CLIENT_ID: z.string(),
  AUTH0_CLIENT_SECRET: z.string(),
  // Google Cloud Storage (OBLIGATORIAS si se usa GCS)
  GCS_PROJECT_ID: z.string(),
  GCS_KEY_FILENAME: z.string(),
  GCS_PUBLIC_BUCKET: z.string(),
  GCS_PRIVATE_BUCKET: z.string(),
  // Opcionales
  REDIS_URL: z.string().url('Invalid REDIS_URL').optional(),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('\n');
      throw new Error(`Invalid environment variables:\n${missingVars}`);
    }
    throw error;
  }
}

