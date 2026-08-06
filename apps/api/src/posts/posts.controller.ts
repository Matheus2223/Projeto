import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ContentFormat,
  Platform,
  PostStatus,
} from '../../generated/prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PostsService } from './posts.service';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private readonly posts: PostsService) {}

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('platform') platform?: Platform,
    @Query('format') format?: ContentFormat,
    @Query('status') status?: PostStatus,
    @Query('take') take?: string,
    @Query('skip') skip?: string,
  ) {
    return this.posts.findAll({
      search,
      platform,
      format,
      status,
      take: take ? Number(take) : undefined,
      skip: skip ? Number(skip) : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.posts.findOne(id);
  }
}
