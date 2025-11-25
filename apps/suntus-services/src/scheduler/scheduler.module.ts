import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from '../infrastructure/database/database.module';
import { WalletT7Job } from './jobs/wallet-t7.job';
import { WalletPayoutsJob } from './jobs/wallet-payouts.job';
import { EscrowReleaseJob } from './jobs/escrow-release.job';

@Module({
  imports: [ScheduleModule.forRoot(), DatabaseModule],
  providers: [WalletT7Job, WalletPayoutsJob, EscrowReleaseJob],
})
export class SchedulerModule {}

