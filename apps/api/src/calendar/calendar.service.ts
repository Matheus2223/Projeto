import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CalendarService {
  constructor(private readonly prisma: PrismaService) {}

  findRange(from: Date, to: Date) {
    return this.prisma.calendarEntry.findMany({
      where: { date: { gte: from, lte: to } },
      orderBy: { date: 'asc' },
    });
  }

  findNext30Days() {
    const from = new Date();
    from.setHours(0, 0, 0, 0);
    const to = new Date(from.getTime() + 29 * 86_400_000);
    return this.findRange(from, to);
  }
}
