/** Credentials used by both API registration and UI login flows. */
export interface UserCredentials {
  email: string;
  password: string;
}

/** Supports both token field names returned by deployed API versions. */
export interface AuthResponse {
  token?: string;
  accessToken?: string;
  user?: { id?: string; email?: string };
}

/** Availability diagnostics returned by the public health endpoint. */
export interface HealthResponse {
  status: 'ok';
  timestamp: string;
  dbStatus: 'connected';
}

/** Feature switches exposed by the public configuration endpoint. */
export interface PublicConfigResponse {
  showExploreLinks: boolean;
}

/** Minimal event shape required by the clients and tests. */
export interface EventRecord {
  id: string;
  title?: string;
  name?: string;
  totalSeats?: number;
  availableSeats?: number;
}

/** Minimal booking shape, including known reference field variants. */
export interface BookingRecord {
  id: string;
  ref?: string;
  reference?: string;
  eventId?: string;
  customerEmail?: string;
}

/** Complete payload required when creating or replacing an event. */
export interface CreateEventInput {
  title: string;
  description: string;
  category: string;
  venue: string;
  city: string;
  eventDate: string;
  price: number;
  totalSeats: number;
}

/** Customer and ticket data accepted by the booking endpoint. */
export interface CreateBookingInput {
  eventId: string;
  quantity: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}
