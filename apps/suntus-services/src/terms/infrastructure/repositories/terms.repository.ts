import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TermsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findCurrentActive() {
    return this.prisma.termsAndConditions.findFirst({
      where: { isActive: true },
      orderBy: { publishedAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.termsAndConditions.findUnique({
      where: { id },
    });
  }

  async findUserAcceptance(userId: string, termsId: string) {
    return this.prisma.termsAcceptance.findFirst({
      where: {
        userId,
        termsId,
      },
      orderBy: { acceptedAt: 'desc' },
    });
  }

  async createAcceptance(data: {
    userId: string;
    termsId: string;
    version: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return this.prisma.termsAcceptance.create({
      data,
    });
  }

  async deactivateAllActive() {
    return this.prisma.termsAndConditions.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });
  }

  async createVersion(data: {
    version: string;
    title: Prisma.InputJsonValue;
    content: Prisma.InputJsonValue;
    isActive: boolean;
    publishedAt: Date;
  }) {
    return this.prisma.termsAndConditions.create({
      data,
    });
  }
}

