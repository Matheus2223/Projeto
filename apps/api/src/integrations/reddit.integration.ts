import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type {
  CollectedTrend,
  SourceIntegration,
} from './integration.interface';

/**
 * Reddit API (OAuth2 script app). Requires REDDIT_CLIENT_ID and
 * REDDIT_CLIENT_SECRET (create at reddit.com/prefs/apps). Used to monitor
 * r/brasil, r/internet, r/InternetBrasil-style subs for connectivity
 * complaints/discussions that signal content opportunities.
 * https://www.reddit.com/dev/api
 */
@Injectable()
export class RedditIntegration implements SourceIntegration {
  readonly key = 'reddit';
  private readonly logger = new Logger(RedditIntegration.name);

  constructor(private readonly config: ConfigService) {}

  collect(): Promise<CollectedTrend[]> {
    const clientId = this.config.get<string>('REDDIT_CLIENT_ID');
    const clientSecret = this.config.get<string>('REDDIT_CLIENT_SECRET');
    if (!clientId || !clientSecret) {
      this.logger.warn(
        'REDDIT_CLIENT_ID/SECRET not set — skipping Reddit collection.',
      );
      return Promise.resolve([]);
    }

    // TODO: POST to https://www.reddit.com/api/v1/access_token (client_credentials
    // grant) then GET /r/<subreddit>/hot.json with the bearer token.
    return Promise.resolve([]);
  }
}
