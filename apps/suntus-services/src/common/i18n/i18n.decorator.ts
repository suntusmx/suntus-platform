import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { I18nService } from './i18n.service';

/**
 * Decorator para inyectar el servicio de i18n en los controladores
 */
export const I18n = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): I18nService => {
    const request = ctx.switchToHttp().getRequest();
    return request.i18nService || new I18nService();
  },
);

