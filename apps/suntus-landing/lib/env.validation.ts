import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url('Invalid NEXT_PUBLIC_API_URL'),
  NEXT_PUBLIC_APP_URL: z.string().url('Invalid NEXT_PUBLIC_APP_URL'),
  // Auth0 (opcionales si no se usa - actualmente comentado por static export)
  AUTH0_SECRET: z.string().optional(),
  AUTH0_BASE_URL: z.string().url('Invalid AUTH0_BASE_URL').optional(),
  AUTH0_ISSUER_BASE_URL: z.string().url('Invalid AUTH0_ISSUER_BASE_URL').optional(),
  AUTH0_CLIENT_ID: z.string().optional(),
  AUTH0_CLIENT_SECRET: z.string().optional(),
  AUTH0_AUDIENCE: z.string().url('Invalid AUTH0_AUDIENCE').optional(),
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
      throw new Error(`Invalid environment variables in suntus-landing:\n${missingVars}`);
    }
    throw error;
  }
}

// Validar al importar el módulo
validateEnv();

