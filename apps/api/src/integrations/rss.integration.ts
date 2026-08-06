import { Injectable, Logger } from '@nestjs/common';
import Parser from 'rss-parser';
import type {
  CollectedTrend,
  SourceIntegration,
} from './integration.interface';

const FEEDS = [
  'https://teletime.com.br/feed/',
  'https://www.telesintese.com.br/feed/',
  'https://olhardigital.com.br/feed/',
];

/**
 * The one integration that needs no API key: pulls RSS feeds from
 * Brazilian telecom/tech portals and normalizes them into CollectedTrend
 * shape (used both for the Notícias page and as raw material the AI can
 * turn into "vídeo educativo"/"post único" ideas).
 */
@Injectable()
export class RssIntegration implements SourceIntegration {
  readonly key = 'blog';
  private readonly logger = new Logger(RssIntegration.name);
  private readonly parser = new Parser();

  async collect(): Promise<CollectedTrend[]> {
    const results: CollectedTrend[] = [];

    for (const feedUrl of FEEDS) {
      try {
        const feed = await this.parser.parseURL(feedUrl);
        for (const item of feed.items.slice(0, 10)) {
          results.push({
            title: item.title ?? 'Sem título',
            summary: item.contentSnippet?.slice(0, 280) ?? '',
            platform: 'blog',
            origin: feed.title ?? feedUrl,
            hashtags: [],
            views: 0,
            engagementRate: 0,
          });
        }
      } catch (error) {
        this.logger.warn(
          `Failed to fetch feed ${feedUrl}: ${(error as Error).message}`,
        );
      }
    }

    return results;
  }
}
