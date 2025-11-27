import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import * as Localization from 'expo-localization';

// Importar traducciones
import commonEs from '../locales/es/common.json';
import commonEn from '../locales/en/common.json';
import authEs from '../locales/es/auth.json';
import authEn from '../locales/en/auth.json';

/**
 * Configuración de i18n para suntus-app
 * Detecta idioma del dispositivo automáticamente
 */
i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: {
      es: {
        common: commonEs,
        auth: authEs,
      },
      en: {
        common: commonEn,
        auth: authEn,
      },
    },
    lng: Localization.getLocales()[0]?.languageCode || 'es',
    fallbackLng: 'es',
    supportedLngs: ['es', 'en'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // React ya escapa valores
    },
  });

export default i18n;

/**
 * Hook helper para usar i18n
 */
export function useI18n() {
  return useTranslation();
}
