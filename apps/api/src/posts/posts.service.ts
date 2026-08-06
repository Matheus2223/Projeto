import { Injectable } from '@nestjs/common';
import {
  ContentFormat,
  Platform,
  PostStatus,
} from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface PostQuery {
  search?: string;
  platform?: Platform;
  format?: ContentFormat;
  status?: PostStatus;
  take?: number;
  skip?: number;
}

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(query: PostQuery) {
    const { search, platform, format, status, take = 24, skip = 0 } = query;
    return this.prisma.post.findMany({
      where: {
        title: search ? { contains: search, mode: 'insensitive' } : undefined,
        platform,
        format,
        status,
      },
      orderBy: { createdAt: 'desc' },
      take,
      skip,
    });
  }

  findOne(id: string) {
    return this.prisma.post.findUnique({ where: { id } });
  }
}
