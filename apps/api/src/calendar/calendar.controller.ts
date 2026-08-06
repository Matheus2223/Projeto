import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CalendarService } from './calendar.service';

@Controller('calendar')
@UseGuards(JwtAuthGuard)
export class CalendarController {
  constructor(private readonly calendar: CalendarService) {}

  @Get()
  findNext30Days() {
    return this.calendar.findNext30Days();
  }
}
