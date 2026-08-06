import { Injectable, Logger } from '@nestjs/common';
import type {
  CollectedTrend,
  SourceIntegration,
} from './integration.interface';

/**
 * Google Trends has no official public API. In production, use a library
 * such as `google-trends-api` (unofficial wrapper around the same endpoints
 * Google Trends' website calls) or a paid provider (SerpApi, DataForSEO).
 *
 * `npm install google-trends-api` and swap the body of `collect()` for:
 *
 *   const trends = await googleTrends.dailyTrends({ geo: 'BR' });
 */
@Injectable()
export class GoogleTrendsIntegration implements SourceIntegration {
  readonly key = 'google_trends';
  private readonly logger = new Logger(GoogleTrendsIntegration.name);

  collect(): Promise<CollectedTrend[]> {
    this.logger.warn(
      'GoogleTrendsIntegration not configured — install google-trends-api and implement collect().',
    );
    return Promise.resolve([]);
  }
}
