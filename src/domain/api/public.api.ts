import type { HealthResponse, PublicConfigResponse } from '../../core/types/domain.js';
import { BaseApi } from './base.api.js';

/** Unauthenticated service metadata and availability operations. */
export class PublicApi extends BaseApi {
  health(): Promise<HealthResponse> {
    return this.call('GET', '/health');
  }

  config(): Promise<PublicConfigResponse> {
    return this.call('GET', '/config');
  }
}
