import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserRole } from '@prisma/client';

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
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User(
      prismaUser.id,
      prismaUser.email,
      prismaUser.name,
      prismaUser.role.toLowerCase() as 'user' | 'expert' | 'admin',
      prismaUser.createdAt,
      prismaUser.updatedAt,
    );
  }
}

