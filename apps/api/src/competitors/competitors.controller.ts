import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CompetitorsService } from './competitors.service';
import { CreateCompetitorDto } from './dto/create-competitor.dto';

@Controller('competitors')
@UseGuards(JwtAuthGuard)
export class CompetitorsController {
  constructor(private readonly competitors: CompetitorsService) {}

  @Get()
  findAll() {
    return this.competitors.findAll();
  }

  @Post()
  create(@Body() dto: CreateCompetitorDto) {
    return this.competitors.create(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.competitors.remove(id);
  }
}
