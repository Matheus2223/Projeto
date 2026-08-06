import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TrendsModule } from './trends/trends.module';
import { IdeasModule } from './ideas/ideas.module';
import { BanksModule } from './banks/banks.module';
import { PostsModule } from './posts/posts.module';
import { CompetitorsModule } from './competitors/competitors.module';
import { CalendarModule } from './calendar/calendar.module';
import { ReportsModule } from './reports/reports.module';
import { NewsModule } from './news/news.module';
import { AiModule } from './ai/ai.module';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    TrendsModule,
    IdeasModule,
    BanksModule,
    PostsModule,
    CompetitorsModule,
    CalendarModule,
    ReportsModule,
    NewsModule,
    AiModule,
    SchedulerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
