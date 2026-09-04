# Framework map

## Technology

- Playwright Test with TypeScript and ESM.
- Chromium is the configured browser project.
- Tests remain fully parallel within a two-worker cap and use two Playwright retries.
- The two-worker cap protects the shared remote API from verified socket drops under higher mutation concurrency.
- Screenshots are captured on failure; trace and video are captured on the first retry.

## Source ownership

| Concern | Location | Responsibility |
| --- | --- | --- |
| Environment validation | `src/core/config/env.ts` | Required `BASE_URL` and `API_URL`; optional credentials |
| Domain types | `src/core/types/domain.ts` | Auth, event, and booking contracts |
| Runtime data | `src/core/utils/data.ts` | Unique users and events |
| Booking data | `src/core/utils/booking-data.ts` | Unique booking payloads |
| API transport | `src/domain/api/base.api.ts` | Request execution and `ApiError` |
| API facade | `src/domain/api/eventhub.api.ts` | Typed client composition and safe-read recovery |
| API clients | `src/domain/api/{auth,events,bookings,public}.api.ts` | Domain endpoint operations |
| Test lifecycle | `src/domain/fixtures/test.ts` | Unique registration, authenticated API, UI login, cleanup |
| UI Page Objects | `src/ui/pages/` | User-facing navigation, forms, and assertions |
| API tests | `tests/api/` | Fast contracts and business rules |
| UI tests | `tests/ui/` | Critical user-visible behavior |
| Static values | `src/data/static.json` | Non-secret stable data only |
| Coverage auditing | `.github/agents/playwright-test-coverage.agent.md` | Evidence-led coverage matrices, prioritized gaps, and duplication review |

## Existing fixture capabilities

- `api`: unauthenticated `EventHubApi`.
- `credentials`: unique generated user credentials.
- `authenticatedApi`: registers the user and exposes a token-authenticated client.
- `ownedEvent`: creates an isolated event and cleans its bookings and event after successful tests.
- `authenticatedPage`: logs in through the UI and waits for navigation.
- `authenticatedCredentials`: exposes the current test user's credentials.

## Current functional coverage

- 44 independent tests: 9 `@smoke` and 35 `@regression`.
- Authentication covers API registration/login/current identity plus UI success and validation paths.
- Events cover create/list/read/update/delete, validation, authentication, ownership, and owned UI discovery/navigation.
- Bookings cover lifecycle, inventory, validation, authentication, ownership, reads by ID/reference, UI form constraints, My Bookings, and cancellation.

## Test selection

```bash
npm run test:smoke
npm run test:regression
npm test
```

Tag only business-critical fast paths as `@smoke`. Use `@regression` for boundaries, authorization, validation, expiry, persistence, and failure behavior.

## Agent workflow

1. Read this map and the application/data maps.
2. Search existing ownership locations.
3. Reuse fixtures, builders, clients, and Page Objects.
4. Add or change the smallest appropriate layer.
5. Run targeted checks, then the full suite when shared code changed.
6. Update maps when a tested contract or ownership boundary changes.

The coverage agent audits and recommends only. Test implementation belongs to the planner/generator workflow, while failure diagnosis belongs to the healer.
