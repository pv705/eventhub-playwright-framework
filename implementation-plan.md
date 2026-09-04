# EventHub framework implementation plan

## Current progress

- Foundation, environment validation, typed API client, POMs, isolated fixtures, static JSON data, quality scripts, and GitHub Actions workflow are implemented.
- Live smoke validation found and corrected the EventHub event contract: event creation returns `{ success, data, message }`, and the numeric `data.id` is normalized to a string.
- Regression validation is green after correcting the full-payload requirement for event updates and normalizing update responses.
- TypeScript and ESLint validation are green; remaining expansion is deeper authenticated UI booking coverage rather than foundation repair.
- The source tree has been reorganized into `core`, `domain`, `ui`, and `data` boundaries; booking create/cancel coverage is now passing against the live API.
- Authenticated UI coverage is now passing for event discovery and bookings navigation. The fixture registers a unique user, synchronizes on the login API response, and only then waits for navigation.
- Session expiry recovery now re-authenticates only safe reads after a 401; UI booking and confirmation coverage is passing.
- API responsibilities are split into shared transport, auth, events, bookings, and public clients. Successful owned events clean associated bookings before deletion.
- GitHub Actions configuration was verified for environment variables, quality gates, smoke/regression commands, and artifact uploads. Remote workflow execution still requires repository variables/secrets.
- CI now validates required GitHub variables/secrets without printing values, and Copilot setup runs the repository's real type-check and lint commands instead of a nonexistent build command.
- Confirmed target repository is `pv705/eventhub-e2e`; CI was reduced to the two required non-secret variables because all current tests generate unique users at runtime.

## Application Overview

Build the EventHub automation framework from scratch using Playwright, TypeScript, and Playwright Test. The implementation will provide a hybrid UI/API architecture with POM, typed API fixtures, unique per-test data, JSON static data, environment-only secrets and URLs, deterministic synchronization, authentication expiry handling, parallel-safe execution, smoke/regression categorization, bounded retries, concise failure artifacts, separate quality-agent responsibilities, and GitHub Actions CI.

## Test Scenarios

### 1. Foundation

**Seed:** `tests/seed.spec.ts`

#### 1.1. Create typed Playwright project foundation

**File:** `tests/foundation/project-setup.spec.ts`

**Steps:**
  1. Create package scripts, TypeScript configuration, Playwright configuration, environment validation, and directory conventions.
    - expect: The project has a typed, maintainable foundation with no hardcoded credentials, URLs, or waits.
  2. Create POM, API client, fixture, data, and utility boundaries.
    - expect: UI and API concerns are separated and reusable without shared mutable state.

#### 1.2. Configure quality checks and guardrails

**File:** `tests/foundation/quality.spec.ts`

**Steps:**
  1. Configure type-check, ESLint, retry limit two, first-retry and final-failure artifacts, and clear reporter output.
    - expect: Quality gates and artifact policies are explicit and maintainable.

### 2. Business-critical coverage

**Seed:** `tests/seed.spec.ts`

#### 2.1. Implement isolated authentication coverage

**File:** `tests/business/auth.spec.ts`

**Steps:**
  1. Create unique users through API fixtures and test API authentication plus UI login and registration behavior.
    - expect: Authentication coverage is efficient, readable, and independent under parallel execution.

#### 2.2. Implement event coverage

**File:** `tests/business/events.spec.ts`

**Steps:**
  1. Create isolated event data through API fixtures and cover discovery, CRUD, validation, authorization, missing records, duplicates, and boundaries.
    - expect: Event behavior is covered through the most appropriate UI/API surface.

#### 2.3. Implement booking coverage

**File:** `tests/business/bookings.spec.ts`

**Steps:**
  1. Create isolated user/event data and cover booking, cancellation, seat boundaries, conflicts, invalid IDs, duplicate submission, and authorization.
    - expect: Booking tests are business-focused, parallel-safe, and cleanup-aware.

#### 2.4. Implement health and configuration coverage

**File:** `tests/business/health-config.spec.ts`

**Steps:**
  1. Validate public health and config endpoints against the documented API contract.
    - expect: Public API checks are fast and deterministic.

### 3. CI and validation

**Seed:** `tests/seed.spec.ts`

#### 3.1. Add GitHub Actions workflows

**File:** `tests/ci/github-actions.spec.ts`

**Steps:**
  1. Add PR smoke and scheduled/manual regression jobs with environment secrets, dependency caching, parallel workers, and report upload.
    - expect: CI is efficient for pull requests and comprehensive for regression.

#### 3.2. Validate the completed framework

**File:** `tests/ci/end-to-end-validation.spec.ts`

**Steps:**
  1. Run the smallest relevant type-check, lint, smoke, and targeted regression commands, then fix failures caused by the implementation.
    - expect: The framework passes available checks and any environmental limitations are explicitly reported.
