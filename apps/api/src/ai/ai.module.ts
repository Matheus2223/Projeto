import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { EmbeddingsService } from './embeddings.service';

@Module({
  controllers: [AiController],
  providers: [AiService, EmbeddingsService],
  exports: [AiService, EmbeddingsService],
})
export class AiModule {}
