import { Module } from '@nestjs/common';
import { LocationsController } from './presentation/rest/locations.controller';
import { LocationsService } from './application/services/locations.service';
import { DatabaseModule } from '../infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [LocationsController],
  providers: [LocationsService],
  exports: [LocationsService],
})
export class LocationsModule {}

