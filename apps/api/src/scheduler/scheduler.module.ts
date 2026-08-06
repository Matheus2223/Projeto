import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { IntegrationsModule } from '../integrations/integrations.module';
import { TrendsModule } from '../trends/trends.module';
import { AiModule } from '../ai/ai.module';
import { DailyUpdateService } from './daily-update.service';
import { SchedulerController } from './scheduler.controller';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    IntegrationsModule,
    TrendsModule,
    AiModule,
  ],
  controllers: [SchedulerController],
  providers: [DailyUpdateService],
})
export class SchedulerModule {}
