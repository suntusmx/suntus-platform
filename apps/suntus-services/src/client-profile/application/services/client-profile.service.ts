import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { CreateClientProfileDto } from '../dto/create-client-profile.dto';
import { AuditService } from '../../../audit/application/services/audit.service';
import { AuditAction } from '../../../audit/domain/enums/audit-action.enum';
import { ActorType } from '../../../audit/domain/enums/actor-type.enum';

@Injectable()
export class ClientProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  /**
   * Crea un ClientProfile para un usuario
   * @param userId - ID del usuario
   * @param dto - Datos del perfil
   * @returns ClientProfile creado
   */
  async create(userId: string, dto: CreateClientProfileDto) {
    // Verificar que el usuario existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar que no tenga ClientProfile ya
    const existingProfile = await this.prisma.clientProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      throw new ConflictException('El usuario ya tiene un perfil de cliente');
    }

    // Validar ubicación existe en catálogo
    await this.validateLocation(dto);

    // Convertir dateOfBirth si viene como string
    const dateOfBirth = typeof dto.dateOfBirth === 'string' 
      ? new Date(dto.dateOfBirth) 
      : dto.dateOfBirth;

    // Validar edad (mínimo 13 años)
    const age = this.calculateAge(dateOfBirth);
    if (age < 13) {
      throw new BadRequestException('Debes tener al menos 13 años para usar la plataforma');
    }
    if (age > 120) {
      throw new BadRequestException('Fecha de nacimiento no válida');
    }

    // Crear perfil
    const profile = await this.prisma.clientProfile.create({
      data: {
        userId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        dateOfBirth,
        initialWeight: dto.initialWeight,
        height: dto.height,
        postalCode: dto.postalCode,
        stateId: dto.stateId,
        municipalityId: dto.municipalityId,
        cityId: dto.cityId,
        neighborhood: dto.neighborhood,
        goal: dto.goal,
        budget: dto.budget,
        gender: dto.gender,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
          },
        },
        state: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        municipality: {
          select: {
            id: true,
            name: true,
          },
        },
        city: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Registrar en AuditLog
    await this.auditService.log({
      entityType: 'ClientProfile',
      entityId: profile.id,
      action: AuditAction.CREATE,
      actorId: userId,
      actorType: ActorType.USER,
      snapshot: {
        after: {
          userId: profile.userId,
          firstName: profile.firstName,
          lastName: profile.lastName,
          goal: profile.goal,
          budget: profile.budget,
        },
      },
    });

    return profile;
  }

  /**
   * Obtiene el ClientProfile de un usuario
   * @param userId - ID del usuario
   * @returns ClientProfile o null
   */
  async findByUserId(userId: string) {
    return this.prisma.clientProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
          },
        },
        state: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        municipality: {
          select: {
            id: true,
            name: true,
          },
        },
        city: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  /**
   * Valida que la ubicación existe en el catálogo
   * @param dto - DTO con datos de ubicación
   */
  private async validateLocation(dto: CreateClientProfileDto) {
    // Verificar estado existe
    const state = await this.prisma.state.findUnique({
      where: { id: dto.stateId },
    });

    if (!state) {
      throw new BadRequestException('El estado especificado no existe');
    }

    // Verificar municipio si se proporciona
    if (dto.municipalityId) {
      const municipality = await this.prisma.municipality.findUnique({
        where: { id: dto.municipalityId },
      });

      if (!municipality || municipality.stateId !== dto.stateId) {
        throw new BadRequestException('El municipio especificado no existe o no pertenece al estado');
      }
    }

    // Verificar ciudad si se proporciona
    if (dto.cityId) {
      const city = await this.prisma.city.findUnique({
        where: { id: dto.cityId },
      });

      if (!city) {
        throw new BadRequestException('La ciudad especificada no existe');
      }

      // Si también hay municipalityId, verificar que la ciudad pertenece al municipio
      if (dto.municipalityId && city.municipalityId !== dto.municipalityId) {
        throw new BadRequestException('La ciudad no pertenece al municipio especificado');
      }
    }

    // Verificar código postal (opcional, pero recomendado)
    if (dto.postalCode) {
      const postalCode = await this.prisma.postalCode.findUnique({
        where: { code: dto.postalCode },
      });

      if (!postalCode) {
        // No es error fatal, solo warning
        console.warn(`Código postal ${dto.postalCode} no encontrado en catálogo`);
      }
    }
  }

  /**
   * Calcula la edad desde una fecha de nacimiento
   * @param dateOfBirth - Fecha de nacimiento
   * @returns Edad en años
   */
  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
      age--;
    }

    return age;
  }
}

