import type { APIRequestContext, APIResponse } from '@playwright/test';

export class ApiError extends Error {
  public constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

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
      throw new ApiError(`${method} ${endpoint} failed with ${response.status()}: ${await response.text()}`, response.status());
    }
    return (await response.json()) as T;
  }
}
