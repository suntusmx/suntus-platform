import { Injectable, Logger } from '@nestjs/common';
import { AuditRepository } from '../../infrastructure/repositories/audit.repository';
import { CreateAuditLogDto } from '../../domain/interfaces/audit-log.interface';
import { AuditAction } from '../../domain/enums/audit-action.enum';
import { ActorType } from '../../domain/enums/actor-type.enum';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly auditRepository: AuditRepository) {}

  async log(data: CreateAuditLogDto): Promise<void> {
    try {
      await this.auditRepository.create(data);
    } catch (error) {
      // Log error pero NO fallar la operación principal
      // Auditoría no debe bloquear funcionalidad
      this.logger.error('Error en auditoría:', error);
    }
  }

  async logTermsAcceptance(
    userId: string,
    termsVersion: string,
    actorName: string,
    actorEmail: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<void> {
    await this.log({
      entityType: 'TermsAndConditions',
      entityId: termsVersion,
      action: AuditAction.ACCEPT,
      actorId: userId,
      actorType: ActorType.USER,
      actorName,
      actorEmail,
      snapshot: {
        after: {
          userId,
          termsVersion,
          acceptedAt: new Date(),
        },
      },
      ipAddress,
      userAgent,
    });
  }

  async logExpertValidation(
    expertId: string,
    adminId: string,
    adminName: string,
    adminEmail: string,
    action: 'APPROVE' | 'REJECT',
    reason?: string,
  ): Promise<void> {
    await this.log({
      entityType: 'Expert',
      entityId: expertId,
      action: action === 'APPROVE' ? AuditAction.APPROVE : AuditAction.REJECT,
      actorId: adminId,
      actorType: ActorType.ADMIN,
      actorName: adminName,
      actorEmail: adminEmail,
      snapshot: {
        after: {
          expertId,
          validationStatus: action === 'APPROVE' ? 'validated' : 'rejected',
          validatedBy: adminId,
          validatedAt: new Date(),
          reason,
        },
      },
      metadata: { reason },
    });
  }

  async logPayment(
    paymentId: string,
    userId: string,
    amount: number,
    suntusCommission: number,
    expertPayout: number,
  ): Promise<void> {
    await this.log({
      entityType: 'Payment',
      entityId: paymentId,
      action: AuditAction.PAYMENT,
      actorId: userId,
      actorType: ActorType.USER,
      snapshot: {
        after: {
          paymentId,
          amount,
          suntusCommission,
          expertPayout,
          processedAt: new Date(),
        },
      },
    });
  }

  async logDataAccess(
    entityType: string,
    entityId: string,
    actorId: string,
    actorType: ActorType,
    actorName?: string,
    ipAddress?: string,
  ): Promise<void> {
    await this.log({
      entityType,
      entityId,
      action: AuditAction.ACCESS,
      actorId,
      actorType,
      actorName,
      snapshot: {
        after: {
          accessedAt: new Date(),
          entityType,
          entityId,
        },
      },
      ipAddress,
    });
  }
}

