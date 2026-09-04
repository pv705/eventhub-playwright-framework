import type { CreateEventInput, UserCredentials } from '../types/domain.js';

export function uniqueSuffix(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function uniqueUser(): UserCredentials {
  const suffix = uniqueSuffix();
  return {
    email: `pw-${suffix}@example.test`,
    password: `Pw!${suffix}Aa1`,
  };
}

export function uniqueEvent(): CreateEventInput {
  const suffix = uniqueSuffix();
  return {
    title: `Automation event ${suffix}`,
    description: 'Event created by an isolated automated test.',
    category: 'Technology',
    venue: 'Automation test venue',
    city: 'Test City',
    eventDate: '2030-01-01T10:00:00.000Z',
    price: 0,
    totalSeats: 10,
  };
}
