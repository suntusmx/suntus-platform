import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url('Invalid NEXT_PUBLIC_API_URL'),
  NEXT_PUBLIC_APP_URL: z.string().url('Invalid NEXT_PUBLIC_APP_URL'),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('\n');
      throw new Error(`Invalid environment variables in suntus-core:\n${missingVars}`);
    }
    throw error;
  }
}

// Validar al importar el módulo
validateEnv();

