import { Module } from '@nestjs/common';
import { UsersController } from './presentation/rest/users.controller';
import { UsersResolver } from './presentation/graphql/users.resolver';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { GetUserUseCase } from './application/use-cases/get-user.use-case';
import { GetAllUsersUseCase } from './application/use-cases/get-all-users.use-case';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { IUserRepository } from './domain/repositories/user.repository.interface';

@Module({
  controllers: [UsersController],
  providers: [
    UsersResolver,
    CreateUserUseCase,
    GetUserUseCase,
    GetAllUsersUseCase,
    {
      // Usar la interfaz como token para mantener desacoplamiento
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    UserRepository,
  ],
  exports: [CreateUserUseCase, GetUserUseCase, GetAllUsersUseCase, UserRepository],
})
export class UsersModule {}

