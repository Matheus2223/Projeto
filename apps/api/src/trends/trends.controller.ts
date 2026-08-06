import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { Platform, TrendStatus } from '../../generated/prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TrendsService } from './trends.service';

@Controller('trends')
@UseGuards(JwtAuthGuard)
export class TrendsController {
  constructor(private readonly trends: TrendsService) {}

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('platform') platform?: Platform,
    @Query('segment') segment?: string,
    @Query('state') state?: string,
    @Query('city') city?: string,
    @Query('status') status?: TrendStatus,
    @Query('take') take?: string,
    @Query('skip') skip?: string,
  ) {
    return this.trends.findAll({
      search,
      platform,
      segment,
      state,
      city,
      status,
      take: take ? Number(take) : undefined,
      skip: skip ? Number(skip) : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trends.findOne(id);
  }
}
