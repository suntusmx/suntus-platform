import { z } from 'zod';

/**
 * Schema para validar campos traducibles en JSONB
 * Estructura: { "es": "...", "en": "...", "native": "..." }
 */
export const TranslatedFieldSchema = z
  .object({
    es: z.string().min(1, 'El texto en español es requerido'),
    en: z.string().optional(),
    native: z.string().optional(),
  })
  .catchall(z.string()); // Permite otros idiomas en el futuro

export type TranslatedField = z.infer<typeof TranslatedFieldSchema>;

/**
 * Schema para validar campos traducibles opcionales
 */
export const TranslatedFieldOptionalSchema = TranslatedFieldSchema.optional();

/**
 * Helper para validar un campo traducible
 */
export function validateTranslatedField(
  field: unknown,
): TranslatedField {
  return TranslatedFieldSchema.parse(field);
}

/**
 * Helper para validar un campo traducible opcional
 */
export function validateTranslatedFieldOptional(
  field: unknown,
): TranslatedField | undefined {
  if (!field) return undefined;
  return TranslatedFieldSchema.parse(field);
}

