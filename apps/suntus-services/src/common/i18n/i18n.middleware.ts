import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { ModuleRef } from '@nestjs/core';
import { I18nService } from './i18n.service';

@Injectable()
export class I18nMiddleware implements NestMiddleware {
  constructor(private readonly moduleRef: ModuleRef) {}

  use(req: FastifyRequest, res: FastifyReply, next: () => void) {
    // Detectar idioma desde:
    // 1. Query parameter ?lang=es
    // 2. Header Accept-Language
    // 3. Usuario autenticado (preferencia guardada)
    // 4. Default: es

    const queryLang = (req.query as any)?.lang;
    const acceptLanguage = req.headers['accept-language'];
    const userLang = (req as any).user?.language; // Si el usuario está autenticado

    let lang = 'es';

    if (queryLang && ['es', 'en'].includes(queryLang)) {
      lang = queryLang;
    } else if (userLang && ['es', 'en'].includes(userLang)) {
      lang = userLang;
    } else if (acceptLanguage) {
      // Parsear Accept-Language header (ej: "es-ES,es;q=0.9,en;q=0.8")
      const preferredLang = acceptLanguage.split(',')[0].split('-')[0].toLowerCase();
      if (['es', 'en'].includes(preferredLang)) {
        lang = preferredLang;
      }
    }

    // Obtener instancia del servicio de i18n
    const i18nService = this.moduleRef.get(I18nService, { strict: false });

    // Cambiar idioma del servicio
    i18nService.changeLanguage(lang);

    // Agregar servicio al request para uso en controladores
    (req as any).i18nService = i18nService;
    (req as any).language = lang;

    next();
  }
}

