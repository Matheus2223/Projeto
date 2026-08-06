import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { IntegrationsModule } from '../integrations/integrations.module';
import { TrendsModule } from '../trends/trends.module';
import { DailyUpdateService } from './daily-update.service';

@Module({
  imports: [ScheduleModule.forRoot(), IntegrationsModule, TrendsModule],
  providers: [DailyUpdateService],
})
export class SchedulerModule {}
