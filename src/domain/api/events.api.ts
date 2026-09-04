import type { CreateEventInput, EventRecord } from '../../core/types/domain.js';
import { BaseApi } from './base.api.js';

export class EventsApi extends BaseApi {
  create(input: CreateEventInput): Promise<EventRecord> {
    return this.call<unknown>('POST', '/events', input).then((payload) => this.eventFromResponse(payload, 'POST /events'));
  }

  get(id: string): Promise<EventRecord> {
    return this.call<unknown>('GET', `/events/${encodeURIComponent(id)}`).then((payload) => this.eventFromResponse(payload, `GET /events/${id}`));
  }

  update(id: string, input: CreateEventInput): Promise<EventRecord> {
    return this.call<unknown>('PUT', `/events/${encodeURIComponent(id)}`, input).then((payload) => this.eventFromResponse(payload, `PUT /events/${id}`));
  }

  delete(id: string): Promise<void> {
    return this.call<void>('DELETE', `/events/${encodeURIComponent(id)}`);
  }

  private eventFromResponse(payload: unknown, operation: string): EventRecord {
    if (typeof payload === 'object' && payload !== null) {
      const candidates: unknown[] = [payload];
      if ('data' in payload) candidates.push(payload.data);
      if ('event' in payload) candidates.push(payload.event);
      for (const candidate of candidates) {
        if (typeof candidate === 'object' && candidate !== null && 'id' in candidate && (typeof candidate.id === 'string' || typeof candidate.id === 'number')) {
          return { ...candidate, id: String(candidate.id) } as EventRecord;
        }
      }
    }
    throw new Error(`${operation} returned an event without an id.`);
  }
}
