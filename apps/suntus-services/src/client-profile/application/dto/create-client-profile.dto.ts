import { z } from 'zod';

/**
 * DTO para crear un ClientProfile
 * Usa Zod para validación compartida con frontend
 */
export const CreateClientProfileDtoSchema = z.object({
  // Datos de Identidad
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(50, 'El nombre es demasiado largo'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres').max(50, 'El apellido es demasiado largo'),
  dateOfBirth: z.string().datetime().or(z.date()),
  
  // Datos Biométricos (opcionales)
  initialWeight: z.number().min(30, 'El peso mínimo es 30kg').max(300, 'El peso máximo es 300kg').optional(),
  height: z.number().min(100, 'La estatura mínima es 100cm').max(250, 'La estatura máxima es 250cm').optional(),
  
  // Datos Geográficos
  postalCode: z.string().length(5, 'El código postal debe tener 5 dígitos').regex(/^\d+$/, 'El código postal solo debe contener números'),
  stateId: z.string().uuid('El ID del estado no es válido'),
  municipalityId: z.string().uuid('El ID del municipio no es válido').optional(),
  cityId: z.string().uuid('El ID de la ciudad no es válido').optional(),
  neighborhood: z.string().optional(),
  
  // Datos de Preferencia
  goal: z.enum(['LOSE_FAT', 'BUILD_MUSCLE', 'MAINTENANCE', 'PERFORMANCE'], {
    errorMap: () => ({ message: 'Objetivo no válido' }),
  }),
  budget: z.enum(['LOW', 'MEDIUM', 'HIGH', 'NO_BUDGET'], {
    errorMap: () => ({ message: 'Presupuesto no válido' }),
  }),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
});

export type CreateClientProfileDto = z.infer<typeof CreateClientProfileDtoSchema>;

