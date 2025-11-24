import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'suntUS API v1 - Backend Services';
  }
}
