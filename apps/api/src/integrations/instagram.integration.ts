import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type {
  CollectedTrend,
  SourceIntegration,
} from './integration.interface';

/**
 * Instagram Graph API (Meta for Developers). Requires a connected Instagram
 * Business/Creator account, a long-lived INSTAGRAM_ACCESS_TOKEN, and the
 * `instagram_basic` + `instagram_manage_insights` permissions to read
 * hashtag/media performance.
 * https://developers.facebook.com/docs/instagram-api
 */
@Injectable()
export class InstagramIntegration implements SourceIntegration {
  readonly key = 'instagram';
  private readonly logger = new Logger(InstagramIntegration.name);

  constructor(private readonly config: ConfigService) {}

  collect(): Promise<CollectedTrend[]> {
    const token = this.config.get<string>('INSTAGRAM_ACCESS_TOKEN');
    if (!token) {
      this.logger.warn(
        'INSTAGRAM_ACCESS_TOKEN not set — skipping Instagram collection.',
      );
      return Promise.resolve([]);
    }

    // TODO: use the `ig_hashtag_search` + `top_media` edges to pull the
    // best-performing posts under connectivity-related hashtags.
    return Promise.resolve([]);
  }
}
