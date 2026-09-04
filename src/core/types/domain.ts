export interface UserCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  accessToken?: string;
  user?: { id?: string; email?: string };
}

export interface EventRecord {
  id: string;
  title?: string;
  name?: string;
  totalSeats?: number;
  availableSeats?: number;
}

export interface BookingRecord {
  id: string;
  ref?: string;
  reference?: string;
  eventId?: string;
  customerEmail?: string;
}

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

export interface CreateBookingInput {
  eventId: string;
  quantity: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}
