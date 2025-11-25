/**
 * Helper para obtener campos traducidos desde JSONB
 * @param field Campo JSONB con estructura { "es": "...", "en": "..." }
 * @param lang Idioma preferido ('es' | 'en')
 * @returns Texto traducido o fallback
 */
export function getTranslatedField(
  field: Record<string, string> | null | undefined,
  lang: 'es' | 'en' = 'es',
): string {
  if (!field || typeof field !== 'object') {
    return '';
  }

  // Intentar obtener el idioma preferido
  if (field[lang]) {
    return field[lang];
  }

  // Fallback a español
  if (field['es']) {
    return field['es'];
  }

  // Fallback al primer valor disponible
  const firstValue = Object.values(field)[0];
  return typeof firstValue === 'string' ? firstValue : '';
}

/**
 * Valida que un campo JSONB tenga la estructura correcta para traducciones
 */
export function isValidTranslatedField(
  field: any,
): field is Record<string, string> {
  if (!field || typeof field !== 'object') {
    return false;
  }

  // Debe tener al menos una clave con valor string
  return Object.values(field).some(
    (value) => typeof value === 'string' && value.length > 0,
  );
}

