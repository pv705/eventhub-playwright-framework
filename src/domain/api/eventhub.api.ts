import type { APIRequestContext } from '@playwright/test';
import { AuthApi } from './auth.api.js';
import { BaseApi } from './base.api.js';
import { BookingsApi } from './bookings.api.js';
import { EventsApi } from './events.api.js';
import { PublicApi } from './public.api.js';
import type { UserCredentials } from '../../core/types/domain.js';
import { ApiError } from './base.api.js';

/** Composes domain clients and keeps their request context and authentication aligned. */
export class EventHubApi extends BaseApi {
  readonly auth: AuthApi;
  readonly events: EventsApi;
  readonly bookings: BookingsApi;
  readonly public: PublicApi;

  public constructor(request: APIRequestContext, baseUrl: string, token?: string) {
    super(request, baseUrl, token);
    this.auth = new AuthApi(request, baseUrl, token);
    this.events = new EventsApi(request, baseUrl, token);
    this.bookings = new BookingsApi(request, baseUrl, token);
    this.public = new PublicApi(request, baseUrl, token);
  }

  withToken(token: string): EventHubApi {
    // Preserve the original client and create an authenticated facade for the test scope.
    return new EventHubApi(this.request, this.baseUrl, token);
  }

  /** Retries one idempotent read after a 401; mutating requests are never replayed. */
  async getEventWithRecovery(id: string, credentials: UserCredentials): Promise<import('../../core/types/domain.js').EventRecord> {
    try {
      return await this.events.get(id);
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 401) throw error;
      const auth = await this.auth.login(credentials);
      const token = auth.token ?? auth.accessToken;
      if (!token) throw new Error('Re-authentication response did not contain an authentication token.');
      // Retry exactly once with the fresh token to avoid hiding persistent failures.
      return await this.withToken(token).events.get(id);
    }
  }
}
