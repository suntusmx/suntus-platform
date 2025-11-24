import { config } from 'dotenv';
import { Module } from '@nestjs/common';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UsersResolver } from '../users/presentation/graphql/users.resolver';
import { UsersModule } from '../users/users.module';
import { validateEnv } from '../common/config/env.validation';

// Cargar variables de entorno
config();

// Validar env al cargar el módulo
const env = validateEnv();

@Module({
  imports: [
    NestGraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: env.NODE_ENV !== 'production',
      introspection: env.NODE_ENV !== 'production',
      context: ({ request }) => ({ request }),
      formatError: (error) => {
        return {
          message: error.message,
          code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
          path: error.path,
          ...(env.NODE_ENV === 'development' && {
            extensions: error.extensions,
          }),
        };
      },
    }),
    UsersModule,
  ],
  providers: [UsersResolver],
})
export class GraphQLConfigModule {}

