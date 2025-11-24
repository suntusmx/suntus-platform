import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';

/**
 * Caso de uso: Crear un nuevo usuario
 * Contiene la lógica de aplicación, no detalles de infraestructura
 */
@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: CreateUserDto): Promise<User> {
    // Validar que el email no exista
    const existingUser = await this.userRepository.findByEmail(
      dto.email.toLowerCase().trim(),
    );

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Lógica de aplicación
    const now = new Date();
    const user = new User(
      crypto.randomUUID(), // En producción, usar un generador de UUIDs
      dto.email.toLowerCase().trim(),
      dto.name.trim(),
      dto.role,
      now,
      now,
    );

    // Guardar en repositorio
    return this.userRepository.save(user);
  }
}

