import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { CreateAuditLogDto } from '../../domain/interfaces/audit-log.interface';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuditRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAuditLogDto) {
    return this.prisma.auditLog.create({
      data: {
        entityType: data.entityType,
        entityId: data.entityId,
        action: data.action as any, // Prisma enum se valida en runtime
        actorId: data.actorId,
        actorType: data.actorType as any, // Prisma enum se valida en runtime
        actorName: data.actorName,
        actorEmail: data.actorEmail,
        snapshot: data.snapshot as any, // Prisma JsonValue type
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        metadata: data.metadata as any, // Prisma JsonValue type
      },
    });
  }

  async findByEntity(entityType: string, entityId: string) {
    return this.prisma.auditLog.findMany({
      where: {
        entityType,
        entityId,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });
  }

  async findByActor(actorId: string) {
    return this.prisma.auditLog.findMany({
      where: {
        actorId,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });
  }
}

