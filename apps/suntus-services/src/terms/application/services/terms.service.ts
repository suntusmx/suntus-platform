import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { TermsRepository } from '../../infrastructure/repositories/terms.repository';
import { TermsAcceptanceStatus, AcceptTermsDto } from '../../domain/interfaces/terms.interface';
import { AuditService } from '../../../audit/application/services/audit.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TermsService {
  constructor(
    private readonly termsRepository: TermsRepository,
    private readonly auditService: AuditService,
  ) {}

  async getCurrentVersion() {
    const terms = await this.termsRepository.findCurrentActive();
    if (!terms) {
      throw new NotFoundException('No hay términos y condiciones activos');
    }
    return terms;
  }

  async checkUserAcceptance(userId: string): Promise<TermsAcceptanceStatus> {
    const currentTerms = await this.termsRepository.findCurrentActive();
    if (!currentTerms) {
      return {
        hasAccepted: false,
        currentVersion: null,
        needsAcceptance: false,
      };
    }

    const acceptance = await this.termsRepository.findUserAcceptance(
      userId,
      currentTerms.id,
    );

    const hasAccepted = !!acceptance;
    const needsAcceptance =
      !hasAccepted || acceptance.version !== currentTerms.version;

    return {
      hasAccepted,
      currentVersion: currentTerms.version,
      acceptedVersion: acceptance?.version,
      needsAcceptance,
    };
  }

  async acceptTerms(
    userId: string,
    dto: AcceptTermsDto,
    actorName: string,
    actorEmail: string,
    ipAddress: string,
    userAgent: string,
  ) {
    const terms = await this.termsRepository.findById(dto.termsId);

    if (!terms || !terms.isActive) {
      throw new ForbiddenException('Términos no válidos o inactivos');
    }

    // Crear aceptación
    const acceptance = await this.termsRepository.createAcceptance({
      userId,
      termsId: dto.termsId,
      version: terms.version,
      ipAddress,
      userAgent,
    });

    // Registrar en AuditLog (CRÍTICO)
    await this.auditService.logTermsAcceptance(
      userId,
      terms.version,
      actorName,
      actorEmail,
      ipAddress,
      userAgent,
    );

    return acceptance;
  }

  async publishNewVersion(
    version: string,
    title: any, // Prisma JsonValue type
    content: any, // Prisma JsonValue type
    adminId: string,
    adminName: string,
  ) {
    // Desactivar versión anterior
    await this.termsRepository.deactivateAllActive();

    // Crear nueva versión
    const newTerms = await this.termsRepository.createVersion({
      version,
      title,
      content,
      isActive: true,
      publishedAt: new Date(),
    });

    // Registrar en AuditLog
    await this.auditService.log({
      entityType: 'TermsAndConditions',
      entityId: newTerms.id,
      action: 'CREATE',
      actorId: adminId,
      actorType: 'ADMIN',
      actorName: adminName,
      snapshot: {
        after: {
          version,
          publishedAt: newTerms.publishedAt,
        },
      },
    });

    return newTerms;
  }
}

