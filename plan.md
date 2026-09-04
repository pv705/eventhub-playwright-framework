# Production-grade EventHub hybrid automation framework skills plan

## Application Overview

Create a maintainable skills.md that instructs planner, healer, type-check, and ESLint agents for a production-style Playwright + TypeScript + Playwright Test framework targeting EventHub. The framework will combine UI Page Object Model coverage with API fixtures, unique per-test data, JSON static data, environment-driven secrets and URLs, deterministic synchronization, authentication-expiry recovery, parallel-safe execution, business-critical smoke/regression categorization, GitHub Actions CI, concise artifacts, and bounded retry behavior. No repository implementation is started until the user explicitly approves implementation.

## Current progress

- Added a repository-level agent context pack with mandatory `AGENTS.md`, framework ownership map, application route/API/locator map, and test-data/authentication map.
- Updated planner, generator, and healer instructions to read the context pack before repository search or live exploration.
- Updated README documentation so future agents and maintainers can find the maps quickly.

## Test Scenarios

### 1. Framework foundation and guardrails

**Seed:** `tests/seed.spec.ts`

#### 1.1. Define environment and project configuration

**File:** `tests/framework/configuration.spec.ts`

**Steps:**
  1. Document Playwright TypeScript configuration with environment-driven BASE_URL, API_URL, TEST_EMAIL, and TEST_PASSWORD values sourced from local environment files and GitHub Actions secrets/variables.
    - expect: No URL, credential, token, generated ID, or environment-specific value is hardcoded in tests. Missing required configuration fails clearly before tests run.
  2. Define browser projects, smoke/regression tags, parallel execution, worker isolation, bounded retries of two, and CI reporter settings.
    - expect: Tests can run independently in parallel, smoke tests are selectable for pull requests, regression tests are selectable for scheduled or approved runs, and retry behavior is deterministic.
  3. Define artifact output conventions under test-results/<project>/<test>/<retry> and HTML report retention in CI.
    - expect: Artifacts are easy to locate and include trace, screenshot, video, console, and relevant request/response evidence according to failure policy.

#### 1.2. Enforce maintainability and safety guardrails

**File:** `tests/framework/guardrails.spec.ts`

**Steps:**
  1. Document agent guardrails for planner, healer, type-check, and ESLint responsibilities.
    - expect: Each agent has a separate responsibility boundary and does not silently mask failures, weaken assertions, bypass configuration, or change unrelated code.
  2. Document prohibited patterns including hardcoded waits, brittle CSS/XPath selectors, generated IDs, shared mutable state, test-order dependencies, broad exception handling, and hidden retries.
    - expect: The skills guidance promotes deterministic synchronization, clear assertions, and explicit surfaced failures.

### 2. Hybrid UI and API business flows

**Seed:** `tests/seed.spec.ts`

#### 2.1. Cover registration and authentication flows

**File:** `tests/business/authentication.spec.ts`

**Steps:**
  1. Create a unique test user through an API fixture using generated, valid credentials; use JSON only for static data and environment variables for secrets and URLs.
    - expect: The user is isolated to the test and can authenticate without sharing state with another test.
  2. Exercise API login and authenticated user validation, then exercise the UI login page as a business-critical UI check using accessible labels or stable test IDs.
    - expect: API and UI authentication assertions are clear, and the UI test verifies successful navigation or authenticated state.
  3. Validate authentication expiry handling using a controlled expired or invalid session condition.
    - expect: The framework detects expiry, refreshes or re-authenticates through the approved fixture path, and never relies on arbitrary sleeps.

#### 2.2. Cover event discovery and CRUD flows

**File:** `tests/business/events.spec.ts`

**Steps:**
  1. Use API fixtures to create unique event data for the test, then discover and validate the event through the UI where applicable.
    - expect: The event is available to the owning test without depending on pre-existing shared records.
  2. Cover create, read/discovery, update, and delete behavior through the supported API/UI surfaces.
    - expect: Assertions reflect business outcomes, data is cleaned on success, and failed-test data is retained with identifiers and evidence for diagnosis.
  3. Cover boundary-value and edge cases for required fields, invalid formats, duplicate/conflicting data, missing records, and unauthorized access.
    - expect: Validation and authorization failures are asserted explicitly with actionable error evidence.

#### 2.3. Cover booking and cancellation flows

**File:** `tests/business/bookings.spec.ts`

**Steps:**
  1. Create isolated event and user data through fixtures, reserve valid ticket quantities, and verify the booking through the supported UI/API flow.
    - expect: Booking creation is atomic from the test perspective, confirmation/reference data is captured, and no test relies on another test's booking.
  2. Cover boundary quantities, unavailable or insufficient seats, invalid event IDs, duplicate submissions, and unauthorized access.
    - expect: Business-critical errors are handled predictably and assertions distinguish validation, conflict, and authorization failures.
  3. Cancel the booking and verify the resulting state and cleanup behavior.
    - expect: Successful tests clean up created resources; failed tests retain only the scoped records needed for debugging.

#### 2.4. Cover API health and public configuration

**File:** `tests/business/api-health.spec.ts`

**Steps:**
  1. Validate the health and public configuration endpoints using the API fixture.
    - expect: Health and feature-flag responses meet the documented contract without requiring user credentials unless the API specifies otherwise.

### 3. Planner, healer, and quality-agent guidance

**Seed:** `tests/seed.spec.ts`

#### 3.1. Generate efficient, business-oriented tests

**File:** `tests/agents/planner.spec.ts`

**Steps:**
  1. Define planner rules for selecting smoke versus regression coverage and prioritizing business-critical flows.
    - expect: Generated tests maximize risk coverage with minimal duplication, use independent data, and remain readable to non-author authors.
  2. Define a locator decision order: accessible role/name, label, placeholder only when stable, dedicated data-testid, then narrowly scoped semantic selectors; prohibit layout selectors and generated IDs.
    - expect: Locators are understandable, resilient, unique where possible, and validated against the live application.

#### 3.2. Recover failures safely

**File:** `tests/agents/healer.spec.ts`

**Steps:**
  1. Define healer diagnosis for locator changes, authentication expiry, API/network faults, validation failures, booking conflicts, and data cleanup failures.
    - expect: The healer inspects evidence first, retries only safe transient operations, limits retries to two, captures screenshot and failure artifacts on the first retry, and surfaces non-retryable failures.
  2. Define healer rules for preserving failed-test data and avoiding unrelated deletion or silent fallback.
    - expect: Failure state remains diagnosable and recovery never creates hidden state sharing or masks the original root cause.

#### 3.3. Separate type-check and ESLint responsibilities

**File:** `tests/agents/static-quality.spec.ts`

**Steps:**
  1. Define type-check agent responsibilities for TypeScript correctness, fixture types, API contracts, and configuration typing.
    - expect: Type errors are reported or fixed without changing behavior or weakening types.
  2. Define ESLint agent responsibilities for repository lint rules, unused code, unsafe patterns, and maintainability.
    - expect: Lint findings are handled consistently without suppressing rules broadly or modifying unrelated files.

### 4. Continuous integration and artifact validation

**Seed:** `tests/seed.spec.ts`

#### 4.1. Define GitHub Actions execution strategy

**File:** `tests/ci/github-actions.spec.ts`

**Steps:**
  1. Document a pull-request workflow that installs dependencies, runs type-check and ESLint agents/checks, then runs smoke tests.
    - expect: PR feedback is fast, failures are clearly separated by validation stage, and secrets are supplied only through GitHub configuration.
  2. Document scheduled or manually selected regression execution with browser/project configuration and parallel workers.
    - expect: Regression coverage is categorized, scalable, and does not depend on execution order.
  3. Document upload and retention of Playwright HTML reports and concise per-test failure artifacts.
    - expect: CI artifacts are discoverable, bounded, and sufficient to diagnose first-retry and final failures.

#### 4.2. Validate skills.md content

**File:** `tests/ci/document-validation.spec.ts`

**Steps:**
  1. Review skills.md against the inspected EventHub routes, registration/login controls, Swagger endpoint groups, and approved framework decisions.
    - expect: The document contains no hardcoded credentials, IDs, or environment URLs in test examples; accurately names supported routes; and states assumptions explicitly.
