import { AuditAction } from '../enums/audit-action.enum';
import { ActorType } from '../enums/actor-type.enum';

export interface CreateAuditLogDto {
  entityType: string;
  entityId: string;
  action: AuditAction | string; // Acepta string para compatibilidad con Prisma enum
  actorId: string;
  actorType: ActorType | string; // Acepta string para compatibilidad con Prisma enum
  actorName?: string;
  actorEmail?: string;
  snapshot: {
    before?: any;
    after?: any;
  };
  ipAddress?: string;
  userAgent?: string;
  metadata?: any;
}

