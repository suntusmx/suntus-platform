import { Module, Global } from '@nestjs/common';
import { AuditService } from './application/services/audit.service';
import { AuditRepository } from './infrastructure/repositories/audit.repository';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';
import { DatabaseModule } from '../infrastructure/database/database.module';

@Global()
@Module({
  imports: [DatabaseModule],
  providers: [AuditService, AuditRepository, AuditInterceptor],
  exports: [AuditService, AuditInterceptor],
})
export class AuditModule {}

