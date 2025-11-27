import { Module } from '@nestjs/common';
import { ClientProfileController } from './presentation/rest/client-profile.controller';
import { ClientProfileService } from './application/services/client-profile.service';
import { DatabaseModule } from '../infrastructure/database/database.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [DatabaseModule, AuditModule],
  controllers: [ClientProfileController],
  providers: [ClientProfileService],
  exports: [ClientProfileService],
})
export class ClientProfileModule {}

