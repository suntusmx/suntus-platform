import { Injectable, Inject } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { NotFoundException } from '../../../common/exceptions/not-found.exception';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';

/**
 * Caso de uso: Obtener un usuario por ID
 */
@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User', userId);
    }
    return user;
  }
}

