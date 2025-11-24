import { FastifyRequest } from 'fastify';
import { CurrentUserPayload } from '../decorators/current-user.decorator';

declare module 'fastify' {
  interface FastifyRequest {
    user?: CurrentUserPayload;
  }
}

