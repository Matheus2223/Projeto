import { Injectable, Logger } from '@nestjs/common';
import type {
  CollectedTrend,
  SourceIntegration,
} from './integration.interface';

/**
 * Anatel publishes open data (consumer complaints ranking, coverage maps,
 * quality indicators) via the Brazilian open-data portal:
 * https://dados.gov.br/dados/organizacoes/visualizar/anatel
 *
 * There's no single "trends" endpoint — in production this integration
 * would poll the relevant CSV/JSON datasets on a schedule and diff them
 * against the previous run to surface newsworthy changes (e.g. a provider's
 * complaint ranking worsening, a new coverage announcement).
 */
@Injectable()
export class AnatelIntegration implements SourceIntegration {
  readonly key = 'anatel';
  private readonly logger = new Logger(AnatelIntegration.name);

  collect(): Promise<CollectedTrend[]> {
    this.logger.warn(
      'AnatelIntegration not configured — implement dataset polling in collect().',
    );
    return Promise.resolve([]);
  }
}
