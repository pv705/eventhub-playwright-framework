# EventHub Production Automation Skills

## Application Overview

# EventHub Production Automation Skills

## Purpose
This document is the operating contract for planner-generator, healer, type-check, and ESLint agents building and maintaining a production-style EventHub automation framework.

## Technology and configuration
- Use Playwright + TypeScript + Playwright Test.
- Use Page Object Model for UI behavior and Playwright APIRequestContext/request fixtures for API behavior and test-data setup.
- Read BASE_URL, API_URL, TEST_EMAIL, and TEST_PASSWORD from environment configuration. Local values come from an untracked environment file; CI values come from GitHub Actions secrets/variables. Never hardcode URLs, credentials, tokens, IDs, dates, or generated references in tests.
- Fail fast with a clear configuration error when a required value is missing or malformed.
- Keep static, non-secret values in JSON fixtures. Generate unique users and domain data at runtime per test.

## Application map
- UI login: `/login`; registration: `/register`.
- API docs: `https://api.eventhub.rahulshettyacademy.com/api/docs/` (use configured API_URL in tests).
- Auth API: POST `/auth/register`, POST `/auth/login`, GET `/auth/me`.
- Events API: GET/POST `/events`, GET/PUT/DELETE `/events/{id}`.
- Bookings API: GET/POST `/bookings`, GET `/bookings/{id}`, GET `/bookings/ref/{ref}`, DELETE `/bookings/{id}`.
- Public API: GET `/health`, GET `/config`.

## Planner-generator rules
1. Prioritize business-critical flows: registration, login, event discovery/CRUD, booking, cancellation, health, and config.
2. Categorize fast, high-risk coverage as `@smoke`; place broader validation, authorization, boundary-value, and failure coverage in `@regression`.
3. Every test starts from a clean logical state and owns all data it creates. Tests must be order-independent and safe under full parallel execution.
4. Use API fixtures to create users, events, and bookings efficiently; use UI only where UI behavior is the subject under test.
5. Keep tests readable: arrange through named fixtures/builders, act through page objects or API clients, and assert business outcomes with explicit messages.
6. Cover valid flows plus BVA and edge cases: required fields, minimum/maximum values, invalid formats, duplicates, missing resources, insufficient seats, unauthorized access, expired sessions, and repeated submissions.
7. Avoid duplicate coverage and unnecessary UI setup. Prefer one API setup call over repeated UI navigation when the setup is not the behavior being tested.

## Locator strategy
Use this order: accessible role and name; associated label; stable placeholder only when it is product-stable; dedicated `data-testid`; narrowly scoped semantic selector. Prefer unique, user-facing locators. Do not use layout selectors, styling classes, positional selectors, brittle XPath, generated IDs, or text that is likely to change. Validate locator uniqueness and visibility at use time; update the POM when the UI contract changes.

## Synchronization and authentication
- Never use hardcoded sleeps or arbitrary polling.
- Rely on Playwright auto-waiting, locator assertions, response predicates, and explicit state assertions.
- Centralize authentication in typed fixtures. Use API login for efficient setup and storage state for UI tests, while retaining a dedicated UI login test.
- Detect 401/expired-session responses and unauthenticated UI state. Re-authenticate or refresh only through the fixture/auth helper, then retry only an idempotent operation. Do not hide an original assertion failure behind re-authentication.
- Keep tokens and storage state out of source control and redact them from logs and artifacts.

## Test data and cleanup
- Generate a unique user and unique domain records for every test using a collision-resistant suffix.
- Do not share mutable data between tests or workers. Do not depend on pre-existing records.
- Track every created resource in the fixture that created it.
- On success, clean up owned resources where supported. On failure, retain only scoped failure data and record its identifiers in the failure artifact. Never delete unrelated or unknown records.
- Make cleanup best-effort but observable: report cleanup failures rather than silently swallowing them.

## Healer rules
1. Inspect the first failure, trace, screenshot, console, request/response evidence, and assertion message before changing code.
2. For locator failures, verify the live accessible tree and choose the smallest stable locator correction; do not weaken assertions or add waits.
3. For transient network/5xx failures, retry only safe/idempotent operations with bounded backoff. Never blindly replay booking, registration, creation, deletion, or other non-idempotent mutations.
4. For authentication expiry, use the central auth fixture and retry the affected safe request once within the test's bounded retry policy.
5. Treat validation, authorization, data conflicts, insufficient seats, missing resources, and assertion failures as non-transient unless evidence proves otherwise.
6. The suite retry limit is exactly two. Capture screenshot and failure artifacts on the first retry and preserve final-failure artifacts. Never add hidden retries in helpers.
7. Preserve evidence and surface unresolved root causes. Never silently return defaults, suppress exceptions broadly, or make unrelated data mutations.

## Quality agents
- **Planner agent:** model business flows, choose smoke/regression scope, ensure independent data, readable steps, BVA/edge coverage, and efficient UI/API boundaries.
- **Healer agent:** diagnose evidence-led failures, make surgical safe fixes, respect retry/idempotency rules, and preserve failure state.
- **Type-check agent:** validate TypeScript, fixture generics, API models, configuration, and strict null/error handling without weakening types.
- **ESLint agent:** enforce repository lint rules, detect unsafe/brittle patterns and unused code, and avoid broad disables or unrelated rewrites.

## CI/CD and artifacts
- GitHub Actions stages: install with lockfile, type-check, ESLint, PR `@smoke`, then scheduled/manual `@regression`.
- Keep secrets in GitHub configuration; never print them. Cache dependencies using the package-manager lockfile.
- Run workers in parallel only when fixtures guarantee isolation.
- Store artifacts at `test-results/<project>/<test>/<retry>/` with concise trace, screenshot, video, console, and relevant request/response evidence. Upload the Playwright HTML report as a CI artifact. Retain artifacts for first retry and final failure; avoid noisy success artifacts.
- Name projects, tests, and artifacts consistently so a failed business flow is identifiable without opening source code.

## Guardrails
No hardcoded waits, credentials, URLs, IDs, tokens, or environment assumptions. No test-order dependency, shared mutable state, broad catches, silent fallback, arbitrary retry, selector weakening, or unrelated cleanup. Any change to the application contract, fixture lifecycle, CI policy, or artifact policy must be explicit, typed, and validated against the live EventHub UI/API contract.

## Test Scenarios

### 1. Planner generator responsibilities

**Seed:** `tests/seed.spec.ts`

#### 1.1. Generate efficient business-critical hybrid tests

**File:** `tests/skills/planner-generator.md`

**Steps:**
  1. Use the planner rules, application map, fixture model, locator hierarchy, synchronization rules, BVA/edge-case coverage, and smoke/regression categorization.
    - expect: Generated tests are readable, parallel-safe, independent, efficient, and avoid hardcoded secrets or waits.

### 2. Healer responsibilities

**Seed:** `tests/seed.spec.ts`

#### 2.1. Heal failures with bounded evidence-led recovery

**File:** `tests/skills/healer.md`

**Steps:**
  1. Apply the healer rules for locator, authentication, network, validation, conflict, cleanup, retry, and artifact handling failures.
    - expect: Only safe failures are retried, retry count is bounded at two, first-retry evidence is retained, and non-retryable failures remain visible.

### 3. Framework quality and CI responsibilities

**Seed:** `tests/seed.spec.ts`

#### 3.1. Maintain type safety lint quality CI and artifacts

**File:** `tests/skills/quality-and-ci.md`

**Steps:**
  1. Apply the quality-agent ownership model and GitHub Actions/artifact policy.
    - expect: Type-check, ESLint, smoke, and regression responsibilities remain separate and CI output is concise, discoverable, and production maintainable.
