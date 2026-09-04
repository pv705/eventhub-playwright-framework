import type { CreateEventInput, UserCredentials } from '../types/domain.js';

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1_000;
const EVENT_DATE_OFFSET_DAYS = 30;

/** Returns an ISO timestamp offset from the current run instead of fixing tests to a calendar date. */
export function isoDateFromNow(daysFromNow: number): string {
  return new Date(Date.now() + daysFromNow * MILLISECONDS_PER_DAY).toISOString();
}

/** Combines time and randomness to avoid collisions between parallel workers. */
export function uniqueSuffix(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Creates credentials for a user owned by one test. */
export function uniqueUser(): UserCredentials {
  const suffix = uniqueSuffix();
  return {
    email: `pw-${suffix}@example.test`,
    password: `Pw!${suffix}Aa1`,
  };
}

/** Creates a future-dated event payload that remains valid whenever the suite runs. */
export function uniqueEvent(): CreateEventInput {
  const suffix = uniqueSuffix();
  return {
    title: `Automation event ${suffix}`,
    description: 'Event created by an isolated automated test.',
    category: 'Technology',
    venue: 'Automation test venue',
    city: 'Test City',
    eventDate: isoDateFromNow(EVENT_DATE_OFFSET_DAYS),
    price: 0,
    totalSeats: 10,
  };
}
