import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type {
  CollectedTrend,
  SourceIntegration,
} from './integration.interface';

/**
 * X (Twitter) API v2. Requires X_BEARER_TOKEN from the X Developer Portal.
 * The free tier has very limited search access — this integration degrades
 * gracefully (returns []) when unavailable so the daily pipeline still runs.
 * https://developer.x.com/en/docs/x-api
 */
@Injectable()
export class XIntegration implements SourceIntegration {
  readonly key = 'x';
  private readonly logger = new Logger(XIntegration.name);

  constructor(private readonly config: ConfigService) {}

  collect(): Promise<CollectedTrend[]> {
    const token = this.config.get<string>('X_BEARER_TOKEN');
    if (!token) {
      this.logger.warn('X_BEARER_TOKEN not set — skipping X collection.');
      return Promise.resolve([]);
    }

    // TODO: GET https://api.x.com/2/tweets/search/recent?query=<termo>&max_results=50
    return Promise.resolve([]);
  }
}
