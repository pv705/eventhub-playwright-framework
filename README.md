# EventHub Automation Framework

Production-style Playwright + TypeScript coverage for EventHub using API-driven setup and Page Objects for UI behavior.

## Agent context

Agents should start with [AGENTS.md](AGENTS.md), then use the framework, application, and data maps in `docs/` before exploring the live application. These maps reduce repeated discovery while preserving live inspection for undocumented flows and contract changes.

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
docs/
  framework-map.md      Source ownership, fixtures, commands, and agent workflow
  application-map.md    Known routes, API surface, and locator contracts
  test-data-and-auth.md Isolation, cleanup, authentication, and synchronization
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
