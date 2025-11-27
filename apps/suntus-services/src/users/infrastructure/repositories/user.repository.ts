import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { Prisma, UserRole } from '@prisma/client';

/**
 * Implementación del repositorio usando Prisma
 * Convierte entre entidades de dominio y modelos de Prisma
 */
@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(user: User): Promise<User> {
    const prismaUser = await this.prisma.user.upsert({
      where: { id: user.id },
      create: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as UserRole,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      update: {
        email: user.email,
        name: user.name,
        role: user.role as UserRole,
        updatedAt: user.updatedAt,
      },
    });

    return this.toDomain(prismaUser);
  }

  async findById(id: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id },
    });

    return prismaUser ? this.toDomain(prismaUser) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { email },
    });

    return prismaUser ? this.toDomain(prismaUser) : null;
  }

  async findByAuth0Id(auth0Id: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { auth0Id },
    });

    return prismaUser ? this.toDomain(prismaUser) : null;
  }

  async create(data: {
    auth0Id?: string;
    email: string;
    name: string;
    role: 'CLIENT' | 'EXPERT';
    language?: string;
    avatar?: string;
  }): Promise<User> {
    const prismaUser = await this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        role: data.role,
        auth0Id: data.auth0Id,
        language: data.language || 'es',
        avatar: data.avatar,
      },
    });

    return this.toDomain(prismaUser);
  }

  async update(id: string, data: Partial<{
    auth0Id?: string;
    name?: string;
    language?: string;
    avatar?: string;
  }>): Promise<User> {
    const prismaUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...(data.auth0Id && { auth0Id: data.auth0Id }),
        ...(data.name && { name: data.name }),
        ...(data.language && { language: data.language }),
        ...(data.avatar && { avatar: data.avatar }),
      },
    });

    return this.toDomain(prismaUser);
  }

  async findAll(): Promise<User[]> {
    const prismaUsers = await this.prisma.user.findMany();
    return prismaUsers.map((u) => this.toDomain(u));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  /**
   * Convierte modelo de Prisma a entidad de dominio
   */
  private toDomain(prismaUser: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    auth0Id?: string | null;
    language?: string | null;
    avatar?: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    // Mapear UserRole de Prisma a role de dominio
    const roleMap: Record<UserRole, 'user' | 'expert' | 'admin'> = {
      CLIENT: 'user',
      EXPERT: 'expert',
    };

    return new User(
      prismaUser.id,
      prismaUser.email,
      prismaUser.name,
      roleMap[prismaUser.role] || 'user',
      prismaUser.createdAt,
      prismaUser.updatedAt,
      prismaUser.auth0Id || undefined,
      prismaUser.language || 'es',
      prismaUser.avatar || undefined,
    );
  }
}

