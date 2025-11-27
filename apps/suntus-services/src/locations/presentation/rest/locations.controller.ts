import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { LocationsService } from '../../application/services/locations.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@Controller('locations')
@UseGuards(JwtAuthGuard)
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  /**
   * Busca ubicación por código postal
   * @param code - Código postal (5 dígitos)
   * @returns Datos de ubicación o null si no se encuentra
   */
  @Get('postal-code/:code')
  async findByPostalCode(@Param('code') code: string) {
    return this.locationsService.findByPostalCode(code);
  }
}

