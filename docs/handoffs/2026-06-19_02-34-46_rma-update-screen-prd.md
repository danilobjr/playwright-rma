# Handoff: RMA Update Screen PRD

## Purpose

Prepare a fresh agent to continue from the RMA Update Screen planning session after the PRD was published to GitHub Issues.

## Current State

- Current branch: `develop`.
- User approved staying on `develop` for this handoff document only.
- PRD published as GitHub issue #44: https://github.com/danilobjr/playwright-rma/issues/44
- Issue #44 has label `ready-for-agent`.
- No implementation work for the RMA Update Screen has started in this session.
- No local PRD file was created; use the GitHub issue as the PRD artifact.

## What Happened

- Ran a grill-with-docs style interview about the next feature: the RMA Update Screen.
- Explored current docs, code, and design enough to ground planning.
- Read `CONTEXT.md` and identified existing RMA glossary terms.
- Inspected the selected Pencil design node in `docs/playwright-rma-design.pen`: `Screen 3 - Update RMA Status`.
- Inspected the existing route/container/page seams for `/rma/$rmaId`.
- Confirmed the current update page is only a placeholder.
- Confirmed the current RMA service has list, peek-next-ID, create, and delete operations, but no dedicated read/update operation yet.
- Confirmed service tests, page tests, and Playwright E2E tests already provide useful testing patterns.
- Published the synthesized PRD to issue #44 with `ready-for-agent`.

## Key References

- Published PRD issue: https://github.com/danilobjr/playwright-rma/issues/44
- Domain glossary: `CONTEXT.md`
- Design artifact: `docs/playwright-rma-design.pen`
- Issue tracker rules: `docs/agents/issue-tracker.md`
- Triage labels: `docs/agents/triage-labels.md`
- Update route container: `src/pages/rma/update/rma-update.container.tsx`
- Update page placeholder: `src/pages/rma/update/rma-update.page.tsx`
- RMA service seam: `src/services/api/rma/rma-request.service.ts`
- RMA model seam: `src/services/api/rma/rma-request.model.ts`
- Existing service tests: `src/services/api/rma/rma-request.service.test.ts`
- Existing routing E2E tests: `e2e/rma-routing.spec.ts`
- Existing create E2E tests: `e2e/rma-create.spec.ts`
- Existing list tests: `src/pages/rma/list/rma-list.page.test.tsx` and `src/pages/rma/list/rma-list.container.test.tsx`

## Decisions Captured Elsewhere

Do not duplicate PRD content from issue #44. It contains the detailed Problem Statement, Solution, User Stories, Implementation Decisions, Testing Decisions, Out of Scope, and Further Notes.

High-level reminders only:

- Build the RMA Update Screen for the existing dynamic route.
- Add dedicated RMA request read behavior instead of deriving update data from the list query.
- Add generic RMA request update behavior with current input limited to `status`.
- Keep status freely editable in this iteration.
- Add randomized service-layer API delay between 1 and 2 seconds for all exported RMA API service responses.
- Keep service delay active in tests and advance fake timers instead of bypassing it.
- Normalize approved UI copy to `Customer name` and `Submitted date` where applicable.
- Use design-approved status descriptions.
- Defer governed status workflow, status workflow popover, status change reason, update history, toast redesign, broader UI reformulation, and pending-save copy improvements.

## Backlog Notes

The backlog items identified during planning are documented in issue #44 under `Further Notes`. Do not create those issues unless the user explicitly asks.

If creating them later, follow the existing backlog issue structure:

- `Context`
- `Problem`
- `Proposed Work`
- `Acceptance Criteria`
- `Related Work`
- `Scope Notes`

Use the `backlog` label and the appropriate type label such as `enhancement`.

## Worktree Notes

Current branch/status observed before this handoff was created:

```text
## develop
?? .committier.json
?? TODO.md
?? commitlint.config_COMMITTIER.mjs
?? docs/handoffs/2026-06-18_21-31-07_fix-e2e-rma-list-states.md
?? docs/handoffs/2026-06-18_21-43-04_create-pr-rma-list-screen.md
?? docs/initial-app-design-analysis.md
?? test-results/
```

Treat those untracked files as pre-existing/user changes unless verified otherwise. Do not revert or modify them without explicit user instruction.

## Suggested Next Steps

- If implementing issue #44, follow the repo rule: show the current branch and ask whether to create a new branch before code changes.
- Before modifying any existing function, class, or method, run GitNexus impact analysis per `AGENTS.md`.
- Start from issue #44 rather than re-interviewing the user.
- Update the glossary only for resolved domain-language decisions and keep it implementation-free.
- Use the Pencil design for static copy and layout direction, while respecting the explicit out-of-scope items from issue #44.
- Preserve unrelated worktree changes.

## Suggested Skills

- `tdd` for implementing the PRD with red-green-refactor.
- `playwright-best-practices` for E2E coverage and timing-sensitive UI behavior.
- `playwright-generate-test` if generating E2E scenarios from the PRD.
- `front-structure` before adding utility, hook, service, page, or test files.
- `tanstack-query` for query/mutation hook additions and invalidation behavior.
- `shadcn` if adding or adjusting UI components from the existing design system.
- `gitnexus-impact-analysis` before editing existing symbols.
- `to-issues` if the user asks to split issue #44 into implementation tickets.
- `handoff` again if the next session needs a compact transfer.

## Redactions

No API keys, passwords, tokens, credentials, or other secrets were present in the conversation context. Public GitHub issue URLs and repository metadata are retained.
