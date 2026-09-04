# EventHub Automation Framework

Production-style Playwright + TypeScript coverage for EventHub using API-driven setup and Page Objects for UI behavior.

## Structure

```text
src/
  core/                 Shared configuration, types, and data builders
  data/                 Non-secret static JSON data
  domain/
    api/                Shared transport plus auth/events/bookings/public clients
    fixtures/           Isolated Playwright fixtures and lifecycle
  ui/pages/             UI Page Objects grouped by feature
tests/
  api/                  API contract and business-flow tests
  ui/                   UI behavior tests
```

## Local setup

```bash
cp .env.example .env
npm install
npx playwright install chromium
npm run typecheck
npm run lint
```

Set `BASE_URL` and `API_URL` in `.env`. Current tests generate unique users through fixtures, so CI does not require stored credentials.

## Test commands

```bash
npm run test:smoke
npm run test:regression
npm test
```

Tests use API setup for speed, own their data, and can run in parallel without execution-order dependencies.

Authenticated reads recover one expired session through the auth client. Mutating operations are never replayed automatically.
