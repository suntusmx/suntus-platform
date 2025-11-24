import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserType } from './users.type';
import { CreateUserInput } from './users.input';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { GetUserUseCase } from '../../application/use-cases/get-user.use-case';
import { GetAllUsersUseCase } from '../../application/use-cases/get-all-users.use-case';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RolesGuard } from '../../../common/guards/roles.guard';

@Resolver(() => UserType)
export class UsersResolver {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
  ) {}

  @Query(() => [UserType], { name: 'users' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getUsers(): Promise<UserType[]> {
    const users = await this.getAllUsersUseCase.execute();
    return users.map((user) => this.toGraphQL(user));
  }

  @Query(() => UserType, { name: 'user' })
  @UseGuards(JwtAuthGuard)
  async getUser(@Args('id', { type: () => ID }) id: string): Promise<UserType> {
    const user = await this.getUserUseCase.execute(id);
    return this.toGraphQL(user);
  }

  @Mutation(() => UserType, { name: 'createUser' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async createUser(
    @Args('input') input: CreateUserInput,
  ): Promise<UserType> {
    const user = await this.createUserUseCase.execute(input);
    return this.toGraphQL(user);
  }

  private toGraphQL(user: any): UserType {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

