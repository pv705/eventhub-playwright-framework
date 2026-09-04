# EventHub application map

## Environment

- UI base URL comes from `BASE_URL`.
- API base URL comes from `API_URL`.
- API documentation: `https://api.eventhub.rahulshettyacademy.com/api/docs/`.
- Never place environment values directly in tests.

## UI routes and Page Objects

| Flow | Route | Page Object |
| --- | --- | --- |
| Root authentication landing and successful-auth destination | `/` | `src/ui/pages/auth/{LoginPage,RegisterPage}.ts` |
| Login | `/login` | `src/ui/pages/auth/LoginPage.ts` |
| Registration | `/register` | `src/ui/pages/auth/RegisterPage.ts` |
| Event discovery | `/events` | `src/ui/pages/events/EventsPage.ts` |
| Event details and ticket booking | `/events/{id}` | `src/ui/pages/events/EventDetailsPage.ts` |
| My bookings | `/bookings` | `src/ui/pages/bookings/BookingsPage.ts` |

Known stable UI contracts:

- An unauthenticated visit to `/` renders the sign-in experience; the previously assumed `Discover and Book Amazing Events` heading and accessible `Browse Events` link are not present.
- Login fields use accessible names `Email`, `Password`, and button `Sign In`.
- Successful login and registration navigate to `/`.
- A successful UI registration establishes a session that can open My Bookings without logging in again.
- Invalid login remains on `/login` and shows `Invalid email or password`.
- Registration rejects mismatched passwords with `Passwords do not match` and weak passwords with `Password does not meet the requirements below` without sending a registration request.
- Event discovery exposes an `Upcoming Events` heading and event cards as articles.
- Each event card exposes its exact event title as a link to `/events/{id}`.
- Event details exposes `Confirm Booking`, `Full Name`, `Email`, and `Phone Number`.
- Event details displays the event title, venue, formatted date, price, and available/total seat count.
- The booking fields are required and the email field uses browser email validation. The phone field is `type="tel"` without a format pattern.
- Booking confirmation exposes a `View My Bookings` link.
- My Bookings exposes the heading `My Bookings`, event titles, ticket quantities, and `Cancel Booking`.
- Cancellation uses the `Cancel this booking?` dialog and `Yes, cancel it`, then shows `Booking cancelled successfully`; a user with no bookings sees `No bookings yet`.
- An unauthenticated visit to `/bookings` redirects to `/login`.
- Login waits for the `/auth/login` response and fails explicitly on non-success status.

## API surface

| Area | Operations |
| --- | --- |
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| Events | `GET/POST /events`, `GET/PUT/DELETE /events/{id}` |
| Bookings | `GET /bookings`, `POST /bookings`, `GET /bookings/{id}`, `GET /bookings/ref/{ref}`, `DELETE /bookings/{id}` |
| Public | `GET /health`, `GET /config` |

API responses may be wrapped in `{ success, data, message }`. Event and booking IDs are normalized to strings by their clients. Event updates require the complete event payload.

Verified API behavior:

- Registration returns HTTP 201 and login returns HTTP 200 with a token and user identity; `GET /auth/me` returns the authenticated identity and rejects missing authentication with HTTP 401.
- Invalid login, weak registration passwords, and duplicate registration return HTTP 400.
- Event collection responses use `{ success, data: Event[], pagination }`; event prices are serialized as strings.
- Event operations, including collection listing, require authentication. A different authenticated user receives HTTP 404 when attempting to update or delete another user's event.
- Blank event titles, past dates, negative prices, and zero seats return HTTP 400. An invalid update leaves the original event unchanged. A deleted event read returns HTTP 404.
- Booking list, creation, and cancellation require authentication. Lists are scoped to the authenticated user, and cross-user cancellation returns HTTP 404.
- Booking reads by ID and reference require authentication. The owner receives the normalized booking, a different authenticated user receives HTTP 403, and a missing booking receives HTTP 404.
- Booking quantities must be positive whole numbers within availability. A missing event returns HTTP 404.
- Booking creation reduces available seats; cancellation removes the booking and restores its seats.
- Health returns `{ status: "ok", timestamp, dbStatus: "connected" }`; the timestamp is ISO-8601 UTC.
- Public config currently returns `{ showExploreLinks: false }`.

## Locator policy

Use this order:

1. Accessible role and name
2. Associated label
3. Stable placeholder
4. Dedicated `data-testid`
5. Narrow semantic selector

Do not use styling classes, layout structure, positional selectors, brittle XPath, or generated IDs. If a known locator fails, inspect the accessible snapshot before changing the Page Object.
