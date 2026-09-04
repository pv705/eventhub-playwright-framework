import type { BookingRecord, CreateBookingInput } from '../../core/types/domain.js';
import { BaseApi } from './base.api.js';

/** Booking operations with response-shape validation at the API boundary. */
export class BookingsApi extends BaseApi {
  list(): Promise<BookingRecord[]> {
    return this.call<unknown>('GET', '/bookings').then((payload) => {
      // Deployments may return either a bare array or a conventional { data } envelope.
      const candidate = typeof payload === 'object' && payload !== null && 'data' in payload ? payload.data : payload;
      if (Array.isArray(candidate)) {
        return candidate.map((booking) => this.bookingFromResponse(booking, 'GET /bookings'));
      }
      throw new Error('GET /bookings returned an unsupported response shape.');
    });
  }

  create(input: CreateBookingInput): Promise<BookingRecord> {
    return this.call<unknown>('POST', '/bookings', input).then((payload) => this.bookingFromResponse(payload, 'POST /bookings'));
  }

  get(id: string): Promise<BookingRecord> {
    return this.call<unknown>('GET', `/bookings/${encodeURIComponent(id)}`).then((payload) => this.bookingFromResponse(payload, `GET /bookings/${id}`));
  }

  getByReference(reference: string): Promise<BookingRecord> {
    return this.call<unknown>('GET', `/bookings/ref/${encodeURIComponent(reference)}`).then((payload) => this.bookingFromResponse(payload, `GET /bookings/ref/${reference}`));
  }

  delete(id: string): Promise<void> {
    return this.call<void>('DELETE', `/bookings/${encodeURIComponent(id)}`);
  }

  private bookingFromResponse(payload: unknown, operation: string): BookingRecord {
    // Accept documented wrapped responses and the bare records returned by some deployments.
    const candidate = typeof payload === 'object' && payload !== null && 'data' in payload ? payload.data : payload;
    if (typeof candidate !== 'object' || candidate === null || !('id' in candidate) || (typeof candidate.id !== 'string' && typeof candidate.id !== 'number')) {
      throw new Error(`${operation} returned a booking without an id.`);
    }

    const record = candidate as BookingRecord & {
      eventId?: string | number;
      bookingRef?: string | number;
    };
    const reference = record.reference ?? record.ref ?? record.bookingRef;

    // Normalize identifiers and reference variants so all read paths expose one contract.
    return {
      ...record,
      id: String(record.id),
      ...(record.eventId === undefined ? {} : { eventId: String(record.eventId) }),
      ...(reference === undefined ? {} : { reference: String(reference) }),
    };
  }
}
