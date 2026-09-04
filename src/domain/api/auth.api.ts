import type { AuthResponse, UserCredentials } from '../../core/types/domain.js';
import { BaseApi } from './base.api.js';

/** Typed operations for EventHub authentication endpoints. */
export class AuthApi extends BaseApi {
  register(credentials: UserCredentials): Promise<AuthResponse> {
    return this.call<AuthResponse>('POST', '/auth/register', credentials);
  }

  login(credentials: UserCredentials): Promise<AuthResponse> {
    return this.call<AuthResponse>('POST', '/auth/login', credentials);
  }

  me(): Promise<unknown> {
    return this.call('GET', '/auth/me');
  }

  withToken(token: string): AuthApi {
    // Return a new client so the original unauthenticated instance remains reusable.
    return new AuthApi(this.request, this.baseUrl, token);
  }
}
