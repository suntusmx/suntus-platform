import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().transform(Number),
  DATABASE_URL: z.string().url('Invalid DATABASE_URL'),
  REDIS_URL: z.string().url('Invalid REDIS_URL').optional(),
  CORS_ORIGIN: z.string(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']),
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

