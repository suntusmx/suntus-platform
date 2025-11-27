import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { getTranslatedField } from '../../../common/utils/i18n';

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Busca ubicación por código postal
   * @param postalCode - Código postal (5 dígitos)
   * @returns Datos de ubicación con estado, municipio, ciudad y colonias
   */
  async findByPostalCode(postalCode: string) {
    if (!postalCode || postalCode.length !== 5 || !/^\d+$/.test(postalCode)) {
      throw new NotFoundException('Código postal inválido');
    }

    // Buscar código postal
    const postalCodeData = await this.prisma.postalCode.findUnique({
      where: { code: postalCode },
      include: {
        municipality: {
          include: {
            state: {
              include: {
                country: true,
              },
            },
          },
        },
        city: true,
      },
    });

    if (!postalCodeData) {
      return null;
    }

    const municipality = postalCodeData.municipality;
    if (!municipality) {
      return null;
    }

    const state = municipality.state;
    const city = postalCodeData.city;

    // Obtener colonias (neighborhoods) para este código postal
    // Por ahora retornamos un array vacío, se puede extender después
    const neighborhoods: string[] = [];

    return {
      stateId: state.id,
      stateName: getTranslatedField(state.name as any, 'es'),
      municipalityId: municipality.id,
      municipalityName: getTranslatedField(municipality.name as any, 'es'),
      cityId: city?.id,
      cityName: city ? getTranslatedField(city.name as any, 'es') : undefined,
      neighborhoods: neighborhoods.length > 0 ? neighborhoods : undefined,
    };
  }
}

