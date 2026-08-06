import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type {
  CollectedTrend,
  SourceIntegration,
} from './integration.interface';

/**
 * TikTok has no general-purpose public trends API. Options for production:
 * 1. TikTok for Developers "Research API" (requires approval, academic/
 *    research use cases).
 * 2. A licensed third-party data provider (e.g. Exolyt, Kalodata).
 * Configure TIKTOK_API_KEY once one of these is contracted.
 */
@Injectable()
export class TiktokIntegration implements SourceIntegration {
  readonly key = 'tiktok';
  private readonly logger = new Logger(TiktokIntegration.name);

  constructor(private readonly config: ConfigService) {}

  collect(): Promise<CollectedTrend[]> {
    const apiKey = this.config.get<string>('TIKTOK_API_KEY');
    if (!apiKey) {
      this.logger.warn('TIKTOK_API_KEY not set — skipping TikTok collection.');
      return Promise.resolve([]);
    }

    // TODO: implement against the contracted provider's API.
    return Promise.resolve([]);
  }
}
