'use client';

/**
 * Configuración simple de i18n para suntus-landing (static export)
 * Usa mensajes JSON estáticos sin rutas dinámicas
 */
import messagesEs from '../messages/es.json';
import messagesEn from '../messages/en.json';

export type Locale = 'es' | 'en';

const messages: Record<Locale, typeof messagesEs> = {
  es: messagesEs,
  en: messagesEn,
};

/**
 * Obtiene el locale actual desde localStorage o detecta del navegador
 */
export function getLocale(): Locale {
  if (typeof window === 'undefined') return 'es';
  
  const stored = localStorage.getItem('locale') as Locale;
  if (stored && (stored === 'es' || stored === 'en')) {
    return stored;
  }
  
  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'en' ? 'en' : 'es';
}

/**
 * Cambia el locale
 */
export function setLocale(locale: Locale): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('locale', locale);
  window.location.reload();
}

/**
 * Obtiene un mensaje traducido
 */
export function t(key: string, locale?: Locale): string {
  const currentLocale = locale || getLocale();
  const keys = key.split('.');
  let value: unknown = messages[currentLocale];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      value = undefined;
      break;
    }
  }
  
  return typeof value === 'string' ? value : key;
}

/**
 * Hook para usar i18n en componentes
 */
export function useI18n() {
  const locale = getLocale();
  
  return {
    locale,
    t: (key: string) => t(key, locale),
    setLocale,
  };
}
