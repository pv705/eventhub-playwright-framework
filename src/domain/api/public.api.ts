import { BaseApi } from './base.api.js';

export class PublicApi extends BaseApi {
  health(): Promise<unknown> {
    return this.call('GET', '/health');
  }

  config(): Promise<unknown> {
    return this.call('GET', '/config');
  }
}
