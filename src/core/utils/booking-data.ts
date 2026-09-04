import type { CreateBookingInput } from '../types/domain.js';

export function bookingInput(eventId: string, suffix: string, quantity: number): CreateBookingInput {
  return {
    eventId,
    quantity,
    customerName: 'Automation Customer',
    customerEmail: `booking-${suffix}@example.test`,
    customerPhone: '+1 555 010 1234',
  };
}
