# EventHub automation agent contract

Before searching source files or opening the live application, every planner, generator, healer, and quality agent must read:

1. `docs/framework-map.md`
2. `docs/application-map.md`
3. `docs/test-data-and-auth.md`
4. `skills.md` when the task changes test strategy, fixtures, retries, artifacts, or CI

Use the maps as the default source of truth. Search the repository before creating a new page object, API client, fixture, builder, locator, or test helper.

## Live exploration policy

Do not rediscover the entire application for every task. Inspect the live DOM or network only when:

- the requested flow is not documented;
- an existing locator or API contract is suspected to have changed;
- a test failure requires fresh evidence; or
- the task explicitly asks for exploratory coverage.

When live evidence changes a contract, update the relevant map in the same change.

## Implementation boundaries

- Put shared configuration, types, and builders in `src/core/`.
- Put API transport and domain clients in `src/domain/api/`.
- Put lifecycle and isolation in `src/domain/fixtures/`.
- Put UI behavior in `src/ui/pages/`.
- Put business tests under the existing `tests/api/` or `tests/ui/` feature folders.
- Use API fixtures for setup and Page Objects for UI behavior.
- Never hardcode credentials, URLs, tokens, generated IDs, waits, or environment-specific state.
- Keep tests independent and safe for full parallel execution.

## Required validation

Run the smallest relevant checks after changes:

```bash
npm run typecheck
npm run lint
npm test
```

Use `BASE_URL` and `API_URL` from `.env` locally or GitHub Actions variables in CI.
