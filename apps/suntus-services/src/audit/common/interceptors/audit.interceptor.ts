import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from '../../application/services/audit.service';
import { AuditAction } from '../../domain/enums/audit-action.enum';
import { ActorType } from '../../domain/enums/actor-type.enum';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { user, method, body, params, query } = request;

    // Obtener datos antes del cambio
    const beforeSnapshot = this.getBeforeSnapshot(request);

    return next.handle().pipe(
      tap(async (response) => {
        // Solo auditar si hay un usuario autenticado
        if (!user) return;

        try {
          await this.auditService.log({
            entityType: this.getEntityType(request),
            entityId: params.id || body.id || query.id,
            action: this.getAction(method),
            actorId: user.id || user.sub,
            actorType: this.getActorType(user),
            actorName: user.name,
            actorEmail: user.email,
            snapshot: {
              before: beforeSnapshot,
              after: response,
            },
            ipAddress: request.ip,
            userAgent: request.headers['user-agent'],
            metadata: {
              method,
              path: request.path,
              query,
            },
          });
        } catch (error) {
          // No fallar la operación principal si la auditoría falla
          console.error('Error en auditoría:', error);
        }
      }),
    );
  }

  private getBeforeSnapshot(request: any): any {
    // Implementar lógica para obtener snapshot antes del cambio
    // Por ahora retornamos el body
    return request.body;
  }

  private getEntityType(request: any): string {
    const path = request.path;
    // Extraer el tipo de entidad del path
    // Ej: /api/v1/users/123 -> "User"
    const segments = path.split('/').filter(Boolean);
    if (segments.length >= 3) {
      const entity = segments[2];
      return entity.charAt(0).toUpperCase() + entity.slice(1);
    }
    return 'Unknown';
  }

  private getAction(method: string): AuditAction {
    const methodMap: Record<string, AuditAction> = {
      GET: AuditAction.ACCESS,
      POST: AuditAction.CREATE,
      PUT: AuditAction.UPDATE,
      PATCH: AuditAction.UPDATE,
      DELETE: AuditAction.DELETE,
    };
    return methodMap[method] || AuditAction.ACCESS;
  }

  private getActorType(user: any): ActorType {
    if (user.role === 'ADMIN') return ActorType.ADMIN;
    if (user.role === 'EXPERT') return ActorType.EXPERT;
    return ActorType.USER;
  }
}

