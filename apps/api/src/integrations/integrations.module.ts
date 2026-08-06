import { Module } from '@nestjs/common';
import { AnatelIntegration } from './anatel.integration';
import { GoogleTrendsIntegration } from './google-trends.integration';
import { InstagramIntegration } from './instagram.integration';
import { RedditIntegration } from './reddit.integration';
import { RssIntegration } from './rss.integration';
import { TiktokIntegration } from './tiktok.integration';
import { XIntegration } from './x.integration';
import { YoutubeIntegration } from './youtube.integration';
import type { SourceIntegration } from './integration.interface';

export const SOURCE_INTEGRATIONS = 'SOURCE_INTEGRATIONS';

const integrationProviders = [
  GoogleTrendsIntegration,
  YoutubeIntegration,
  RedditIntegration,
  XIntegration,
  InstagramIntegration,
  TiktokIntegration,
  AnatelIntegration,
  RssIntegration,
];

@Module({
  providers: [
    ...integrationProviders,
    {
      provide: SOURCE_INTEGRATIONS,
      useFactory: (...integrations: SourceIntegration[]) => integrations,
      inject: integrationProviders,
    },
  ],
  exports: [SOURCE_INTEGRATIONS],
})
export class IntegrationsModule {}
