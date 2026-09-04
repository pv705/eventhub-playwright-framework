import type { CreateEventInput, EventRecord } from '../../core/types/domain.js';
import { BaseApi } from './base.api.js';

/** CRUD operations for events, including normalization of deployed response variants. */
export class EventsApi extends BaseApi {
  list(): Promise<EventRecord[]> {
    return this.call<unknown>('GET', '/events').then((payload) => this.eventsFromResponse(payload, 'GET /events'));
  }

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

  private eventsFromResponse(payload: unknown, operation: string): EventRecord[] {
    const candidates: unknown[] = [payload];
    if (typeof payload === 'object' && payload !== null) {
      if ('data' in payload) candidates.push(payload.data);
      if ('events' in payload) candidates.push(payload.events);
    }

    const records = candidates.find((candidate): candidate is unknown[] => Array.isArray(candidate));
    if (!records) throw new Error(`${operation} returned a response without an event collection.`);

    return records.map((record) => this.eventFromResponse(record, operation));
  }

  private eventFromResponse(payload: unknown, operation: string): EventRecord {
    if (typeof payload === 'object' && payload !== null) {
      // Search the bare payload and both envelope names observed from the service.
      const candidates: unknown[] = [payload];
      if ('data' in payload) candidates.push(payload.data);
      if ('event' in payload) candidates.push(payload.event);
      for (const candidate of candidates) {
        if (typeof candidate === 'object' && candidate !== null && 'id' in candidate && (typeof candidate.id === 'string' || typeof candidate.id === 'number')) {
          // Expose identifiers as strings regardless of the backend storage type.
          return { ...candidate, id: String(candidate.id) } as EventRecord;
        }
      }
    }
    throw new Error(`${operation} returned an event without an id.`);
  }
}
