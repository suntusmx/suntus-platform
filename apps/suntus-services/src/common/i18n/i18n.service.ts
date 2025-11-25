import { Injectable, OnModuleInit } from '@nestjs/common';
import { join } from 'path';

// Importar i18next usando require para compatibilidad con CommonJS
const i18next = require('i18next');

@Injectable()
export class I18nService implements OnModuleInit {
  async onModuleInit() {
    // Verificar que i18next esté disponible
    if (!i18next || typeof i18next.use !== 'function') {
      throw new Error('i18next is not available or invalid');
    }
    
    if (!i18next.isInitialized) {
      // Importar Backend dinámicamente para evitar problemas de CommonJS/ESM
      const BackendModule = await import('i18next-fs-backend');
      const Backend = (BackendModule as any).default || BackendModule;
      i18next.use(Backend);
      await i18next.init({
      lng: 'es', // Idioma por defecto
      fallbackLng: 'es',
      supportedLngs: ['es', 'en'],
      ns: [
        'common',
        'auth',
        'profile',
        'subscription',
        'nutrition',
        'sports',
        'billing',
        'metrics',
        'help',
        'fitoteca',
        'directory',
        'plans',
        'admin',
      ],
      defaultNS: 'common',
      backend: {
        loadPath: join(process.cwd(), 'apps/suntus-services/locales/{{lng}}/{{ns}}.json'),
      },
      interpolation: {
        escapeValue: false, // React ya escapa valores
      },
      returnEmptyString: false,
      returnNull: false,
      });
    }
  }

  /**
   * Obtiene una traducción por namespace y clave
   */
  t(key: string, options?: { lng?: string; ns?: string; [key: string]: any }): string {
    const { lng, ns, ...interpolation } = options || {};
    return i18next.t(key, {
      lng: lng || 'es',
      ns: ns || 'common',
      ...interpolation,
    });
  }

  /**
   * Cambia el idioma actual
   */
  async changeLanguage(lng: string): Promise<void> {
    await i18next.changeLanguage(lng);
  }

  /**
   * Obtiene el idioma actual
   */
  getLanguage(): string {
    return i18next.language;
  }
}

