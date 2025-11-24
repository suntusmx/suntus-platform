import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { GetUserUseCase } from '../../application/use-cases/get-user.use-case';
import { GetAllUsersUseCase } from '../../application/use-cases/get-all-users.use-case';
import { CreateUserDto, CreateUserDtoSchema } from '../../application/dto/create-user.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RolesGuard } from '../../../common/guards/roles.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async findAll() {
    return this.getAllUsersUseCase.execute();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.getUserUseCase.execute(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async create(
    @Body(new ZodValidationPipe(CreateUserDtoSchema)) createUserDto: CreateUserDto,
  ) {
    return this.createUserUseCase.execute(createUserDto);
  }
}
