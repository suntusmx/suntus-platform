import { Catch, ArgumentsHost } from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch()
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const ctx = gqlHost.getContext();

    if (exception instanceof GraphQLError) {
      return exception;
    }

    if (exception instanceof Error) {
      return new GraphQLError(exception.message, {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          timestamp: new Date().toISOString(),
          path: ctx?.req?.url,
        },
      });
    }

    return new GraphQLError('Internal server error', {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        timestamp: new Date().toISOString(),
      },
    });
  }
}

