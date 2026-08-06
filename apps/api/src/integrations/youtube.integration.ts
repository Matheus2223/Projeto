import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type {
  CollectedTrend,
  SourceIntegration,
} from './integration.interface';

/**
 * YouTube Data API v3. Requires YOUTUBE_API_KEY (Google Cloud Console,
 * enable "YouTube Data API v3"). Used here to pull trending Shorts for
 * ISP-relevant search terms via `search.list` + `videos.list` (for stats).
 * https://developers.google.com/youtube/v3/docs/search/list
 */
@Injectable()
export class YoutubeIntegration implements SourceIntegration {
  readonly key = 'youtube_shorts';
  private readonly logger = new Logger(YoutubeIntegration.name);

  constructor(private readonly config: ConfigService) {}

  collect(): Promise<CollectedTrend[]> {
    const apiKey = this.config.get<string>('YOUTUBE_API_KEY');
    if (!apiKey) {
      this.logger.warn(
        'YOUTUBE_API_KEY not set — skipping YouTube collection.',
      );
      return Promise.resolve([]);
    }

    // TODO: call https://www.googleapis.com/youtube/v3/search with
    // q=<termo relacionado a internet/fibra/wifi>, type=video,
    // videoDuration=short, order=viewCount, regionCode=BR — then map the
    // response into CollectedTrend[].
    return Promise.resolve([]);
  }
}
