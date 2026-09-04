import type { APIRequestContext, APIResponse } from '@playwright/test';

/** HTTP failure carrying a status code for targeted recovery and assertions. */
export class ApiError extends Error {
  public constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

/** Shared transport that handles URL composition, bearer auth, and error conversion. */
export class BaseApi {
  public constructor(
    protected readonly request: APIRequestContext,
    protected readonly baseUrl: string,
    protected readonly token?: string,
  ) {}

  protected async call<T>(method: string, endpoint: string, data?: unknown): Promise<T> {
    const response: APIResponse = await this.request.fetch(`${this.baseUrl}${endpoint}`, {
      method,
      data,
      headers: this.token ? { Authorization: `Bearer ${this.token}` } : undefined,
    });
    if (!response.ok()) {
      // Include the response body because API validation messages are useful test evidence.
      throw new ApiError(`${method} ${endpoint} failed with ${response.status()}: ${await response.text()}`, response.status());
    }
    return (await response.json()) as T;
  }
}
