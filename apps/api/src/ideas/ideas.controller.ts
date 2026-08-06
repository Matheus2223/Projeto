import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ContentFormat,
  Difficulty,
  Platform,
} from '../../generated/prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtPayload } from '../auth/jwt.strategy';
import { IdeasService } from './ideas.service';

@Controller('ideas')
@UseGuards(JwtAuthGuard)
export class IdeasController {
  constructor(private readonly ideas: IdeasService) {}

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('format') format?: ContentFormat,
    @Query('platform') platform?: Platform,
    @Query('difficulty') difficulty?: Difficulty,
    @Query('take') take?: string,
    @Query('skip') skip?: string,
  ) {
    return this.ideas.findAll({
      search,
      format,
      platform,
      difficulty,
      take: take ? Number(take) : undefined,
      skip: skip ? Number(skip) : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ideas.findOne(id);
  }

  @Post(':id/favorite')
  toggleFavorite(@Param('id') id: string, @Req() req: { user: JwtPayload }) {
    return this.ideas.toggleFavorite(req.user.sub, id);
  }
}
