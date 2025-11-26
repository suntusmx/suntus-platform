import { z } from 'zod';

const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.string().url('Invalid EXPO_PUBLIC_API_URL'),
  EXPO_PUBLIC_AUTH0_DOMAIN: z.string().min(1, 'EXPO_PUBLIC_AUTH0_DOMAIN is required'),
  EXPO_PUBLIC_AUTH0_CLIENT_ID: z.string().min(1, 'EXPO_PUBLIC_AUTH0_CLIENT_ID is required'),
  EXPO_PUBLIC_AUTH0_AUDIENCE: z.string().url('Invalid EXPO_PUBLIC_AUTH0_AUDIENCE'),
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
      throw new Error(`Invalid environment variables in suntus-app:\n${missingVars}`);
    }
    throw error;
  }
}

// Validar al importar el módulo
validateEnv();

