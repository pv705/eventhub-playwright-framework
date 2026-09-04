# EventHub application map

## Environment

- UI base URL comes from `BASE_URL`.
- API base URL comes from `API_URL`.
- API documentation: `https://api.eventhub.rahulshettyacademy.com/api/docs/`.
- Never place environment values directly in tests.

## UI routes and Page Objects

| Flow | Route | Page Object |
| --- | --- | --- |
| Home | `/` | `src/ui/pages/HomePage.ts` |
| Login | `/login` | `src/ui/pages/auth/LoginPage.ts` |
| Registration | `/register` | `src/ui/pages/auth/RegisterPage.ts` |
| Event discovery | `/events` | `src/ui/pages/events/EventsPage.ts` |
| Event details and ticket booking | `/events/{id}` | `src/ui/pages/events/EventDetailsPage.ts` |
| My bookings | `/bookings` | `src/ui/pages/bookings/BookingsPage.ts` |

Known stable UI contracts:

- Login fields use accessible names `Email`, `Password`, and button `Sign In`.
- Event discovery exposes an `Upcoming Events` heading and event cards as articles.
- Event details exposes `Confirm Booking`, `Full Name`, `Email`, and `Phone Number`.
- Login waits for the `/auth/login` response and fails explicitly on non-success status.

## API surface

| Area | Operations |
| --- | --- |
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| Events | `GET/POST /events`, `GET/PUT/DELETE /events/{id}` |
| Bookings | `GET /bookings`, `POST /bookings`, `DELETE /bookings/{id}` |
| Public | `GET /health`, `GET /config` |

API responses may be wrapped in `{ success, data, message }`. Event and booking IDs are normalized to strings by their clients. Event updates require the complete event payload.

## Locator policy

Use this order:

1. Accessible role and name
2. Associated label
3. Stable placeholder
4. Dedicated `data-testid`
5. Narrow semantic selector

Do not use styling classes, layout structure, positional selectors, brittle XPath, or generated IDs. If a known locator fails, inspect the accessible snapshot before changing the Page Object.
