import type { BookingRecord, CreateBookingInput } from '../../core/types/domain.js';
import { BaseApi } from './base.api.js';

export class BookingsApi extends BaseApi {
  list(): Promise<BookingRecord[]> {
    return this.call<unknown>('GET', '/bookings').then((payload) => {
      const candidate = typeof payload === 'object' && payload !== null && 'data' in payload ? payload.data : payload;
      if (Array.isArray(candidate)) return candidate as BookingRecord[];
      throw new Error('GET /bookings returned an unsupported response shape.');
    });
  }

  create(input: CreateBookingInput): Promise<BookingRecord> {
    return this.call<unknown>('POST', '/bookings', input).then((payload) => {
      const candidate = typeof payload === 'object' && payload !== null && 'data' in payload ? payload.data : payload;
      if (typeof candidate === 'object' && candidate !== null && 'id' in candidate && (typeof candidate.id === 'string' || typeof candidate.id === 'number')) {
        return { ...candidate, id: String(candidate.id) } as BookingRecord;
      }
      throw new Error('POST /bookings returned a booking without an id.');
    });
  }

  delete(id: string): Promise<void> {
    return this.call<void>('DELETE', `/bookings/${encodeURIComponent(id)}`);
  }
}
