/** Normalized shape every integration service returns to the scheduler. */
export interface CollectedTrend {
  title: string;
  summary: string;
  platform: string;
  origin: string;
  hashtags: string[];
  views: number;
  engagementRate: number;
}

export interface SourceIntegration {
  /** Unique key used in Settings > Fontes monitoradas. */
  readonly key: string;
  /** Fetches the latest signals from the source. Throws on auth/network failure. */
  collect(): Promise<CollectedTrend[]>;
}
