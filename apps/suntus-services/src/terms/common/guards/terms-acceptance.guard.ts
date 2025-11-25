import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TermsService } from '../../application/services/terms.service';
import { Public } from '../../../common/decorators/public.decorator';

@Injectable()
export class TermsAcceptanceGuard implements CanActivate {
  constructor(
    private readonly termsService: TermsService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Verificar si la ruta es pública
    const isPublic = this.reflector.getAllAndOverride<boolean>(Public, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) return true; // Si no está autenticado, otro guard lo maneja

    // Rutas excluidas (no requieren aceptación)
    const excludedRoutes = [
      '/api/v1/auth',
      '/api/v1/terms',
      '/api/v1/health',
    ];

    if (excludedRoutes.some((route) => request.path.startsWith(route))) {
      return true;
    }

    const { needsAcceptance, currentVersion } =
      await this.termsService.checkUserAcceptance(user.id);

    if (needsAcceptance) {
      // App Blocker: Lanzar error que el frontend debe manejar
      throw new ForbiddenException({
        code: 'TERMS_NOT_ACCEPTED',
        message:
          'Debes aceptar los nuevos Términos y Condiciones para continuar',
        currentVersion,
        redirectTo: '/terms/accept',
      });
    }

    return true;
  }
}

