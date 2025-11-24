import { InputType, Field } from '@nestjs/graphql';
import { CreateUserDtoSchema } from '../../application/dto/create-user.dto';
import { createZodDto } from 'nestjs-zod';

// Crear DTO de GraphQL desde el schema de Zod
@InputType()
export class CreateUserInput extends createZodDto(CreateUserDtoSchema) {
  @Field(() => String)
  email!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String, { nullable: true, defaultValue: 'user' })
  role?: 'user' | 'expert' | 'admin';
}

