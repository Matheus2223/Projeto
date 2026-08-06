import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DailyUpdateService } from './daily-update.service';

@Controller('scheduler')
@UseGuards(JwtAuthGuard)
export class SchedulerController {
  constructor(private readonly dailyUpdate: DailyUpdateService) {}

  /**
   * Manually triggers the same pipeline that runs automatically every day
   * at 07:00 — useful for an admin who doesn't want to wait, and for
   * verifying the pipeline works without waiting for the schedule.
   */
  @Post('run-daily-update')
  runNow() {
    return this.dailyUpdate.run();
  }
}
