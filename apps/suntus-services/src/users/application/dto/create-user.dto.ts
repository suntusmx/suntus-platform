import { z } from 'zod';

/**
 * DTO para crear un usuario
 * Usa Zod para validación compartida con frontend
 */
export const CreateUserDtoSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  role: z.enum(['user', 'expert', 'admin']).default('user'),
});

export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;

