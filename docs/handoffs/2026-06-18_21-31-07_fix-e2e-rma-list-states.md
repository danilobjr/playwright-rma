# Fix E2E RMA List States

## Summary

Debugged and fixed 3 failing E2E tests for RMA list states (initial empty, filtered empty, corrupted-data error). All on branch `23/rma-list-states`, PR #41 targeting `15/rma-list-screen`.

## What Changed

Two commits on `23/rma-list-states`:

1. `60ee257` — `✨ feat(rma/list): add loading, empty, and error states` — feature code + unit tests + shadcn components
2. `7be6105` — `🧪 test(rma/list): e2e coverage for empty and error states` — 3 E2E tests

See PR #41 for full diff: https://github.com/danilobjr/playwright-rma/pull/41

## Fixes Applied (to `e2e/rma-list.spec.ts`)

| Problem | Root Cause | Fix |
|---|---|---|
| Initial empty: `getByRole('link', { name: /New RMA/ })` strict violation | Two "New RMA" links (header + empty component) | Added `.first()` |
| Error: alert never appears | React Query retries 3x with exponential backoff (~7s total); test timeout was 5s | Increased assertion timeout to `15000ms` |
| Lint: `no-var` | `addInitScript` used `var` (ESLint treats body as source) | Changed to `const` |

## Key Insight for Error Testing

React Query's default `retry: 3` with exponential backoff means `isError` takes ~7s to surface. E2E assertions testing error states need `{ timeout: 15000 }` or `retry: false` in query options (latter changes production behavior).

## Artifacts

- **PR:** #41 — https://github.com/danilobjr/playwright-rma/pull/41
- **Issue:** #23 (RMA List States) — AC updated, all items checked
- **Backlog:** #42 (mobile skeleton iteration)

## Remaining

- PR #41 is open, not yet merged
- Branch `23/rma-list-states` has uncommitted tooling/config files: `.husky/commit-msg`, `opencode.json`, `.committier.json`, `commitlint.config_COMMITTIER.mjs`, `TODO.md`, `docs/initial-app-design-analysis.md`, `test-results/`
- Backlog issue #42 for mobile skeleton labeled-section improvement

## Suggested Skills

- `playwright-best-practices` — E2E patterns for error/empty state testing with `addInitScript`
- `gitnexus-impact-analysis` — before changing `readActiveRmaRequests` or `listRmaRequests`
- `skill` — handoff, commit, create-pr (standard workflow skills)
