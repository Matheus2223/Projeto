import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async findLatest() {
    const report = await this.prisma.dailyReport.findFirst({
      orderBy: { date: 'desc' },
    });
    if (!report) throw new NotFoundException('Nenhum relatório gerado ainda');
    return report;
  }

  findByDate(date: Date) {
    return this.prisma.dailyReport.findUnique({ where: { date } });
  }
}
