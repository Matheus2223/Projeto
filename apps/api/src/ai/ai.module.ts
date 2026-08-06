import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { EmbeddingsService } from './embeddings.service';
import { IdeasGenerationService } from './ideas-generation.service';

@Module({
  controllers: [AiController],
  providers: [AiService, EmbeddingsService, IdeasGenerationService],
  exports: [AiService, EmbeddingsService, IdeasGenerationService],
})
export class AiModule {}
