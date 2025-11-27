import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

/**
 * Guard que verifica que el usuario tenga un ClientProfile
 * Si no lo tiene, lanza ForbiddenException con código específico
 */
@Injectable()
export class ClientProfileGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return true; // Si no está autenticado, otro guard lo maneja
    }

    // Solo aplica a usuarios CLIENT
    if (user.role !== 'CLIENT') {
      return true; // Expertos no necesitan ClientProfile
    }

    // Verificar si tiene ClientProfile
    const profile = await this.prisma.clientProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      throw new ForbiddenException({
        code: 'CLIENT_PROFILE_REQUIRED',
        message: 'Debes completar tu perfil para continuar',
      });
    }

    return true;
  }
}

