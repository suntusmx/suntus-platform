import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor(resource: string, identifier?: string) {
    const message = identifier
      ? `${resource} with identifier ${identifier} not found`
      : `${resource} not found`;
    super(message, HttpStatus.NOT_FOUND);
  }
}

