import { IsArray, IsEnum, IsString } from 'class-validator';
import { Platform } from '../../../generated/prisma/client';

export class CreateCompetitorDto {
  @IsString()
  name: string;

  @IsString()
  handle: string;

  @IsArray()
  @IsEnum(Platform, { each: true })
  platforms: Platform[];

  @IsString()
  segment: string;
}
