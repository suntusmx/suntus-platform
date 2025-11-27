import { Controller, Post, Get, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ClientProfileService } from '../../application/services/client-profile.service';
import { CreateClientProfileDto, CreateClientProfileDtoSchema } from '../../application/dto/create-client-profile.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

@Controller('client-profile')
@UseGuards(JwtAuthGuard)
export class ClientProfileController {
  constructor(private readonly clientProfileService: ClientProfileService) {}

  /**
   * Crea un ClientProfile para el usuario autenticado
   * @param user - Usuario autenticado (inyectado por CurrentUser)
   * @param dto - Datos del perfil
   * @returns ClientProfile creado
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: any,
    @Body(new ZodValidationPipe(CreateClientProfileDtoSchema)) dto: CreateClientProfileDto,
  ) {
    return this.clientProfileService.create(user.id, dto);
  }

  /**
   * Obtiene el ClientProfile del usuario autenticado
   * @param user - Usuario autenticado
   * @returns ClientProfile o null
   */
  @Get()
  async findOne(@CurrentUser() user: any) {
    return this.clientProfileService.findByUserId(user.id);
  }
}

