import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BankCategory, Platform } from '../../generated/prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BanksService } from './banks.service';

@Controller('banks')
@UseGuards(JwtAuthGuard)
export class BanksController {
  constructor(private readonly banks: BanksService) {}

  @Get(':category')
  findAll(
    @Param('category') category: BankCategory,
    @Query('search') search?: string,
    @Query('platform') platform?: Platform,
    @Query('sort') sort?: 'performance' | 'usage',
    @Query('take') take?: string,
    @Query('skip') skip?: string,
  ) {
    return this.banks.findAll({
      category,
      search,
      platform,
      sort,
      take: take ? Number(take) : undefined,
      skip: skip ? Number(skip) : undefined,
    });
  }

  @Patch(':id/usage')
  incrementUsage(@Param('id') id: string) {
    return this.banks.incrementUsage(id);
  }
}
