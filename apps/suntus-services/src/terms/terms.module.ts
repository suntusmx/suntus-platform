import { Module } from '@nestjs/common';
import { TermsService } from './application/services/terms.service';
import { TermsRepository } from './infrastructure/repositories/terms.repository';
import { TermsController } from './presentation/rest/terms.controller';
import { TermsAcceptanceGuard } from './common/guards/terms-acceptance.guard';
import { DatabaseModule } from '../infrastructure/database/database.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [DatabaseModule, AuditModule],
  providers: [TermsService, TermsRepository, TermsAcceptanceGuard],
  controllers: [TermsController],
  exports: [TermsService, TermsAcceptanceGuard],
})
export class TermsModule {}

