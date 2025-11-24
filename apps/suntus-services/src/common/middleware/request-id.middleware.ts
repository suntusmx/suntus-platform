import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { randomUUID } from 'crypto';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
    const requestId = req.headers['x-request-id'] || randomUUID();
    req.headers['x-request-id'] = requestId as string;
    res.setHeader('x-request-id', requestId as string);
    next();
  }
}

