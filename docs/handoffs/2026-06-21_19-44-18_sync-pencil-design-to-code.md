# Handoff: Sync Pencil design to code

## Context

Session focused on syncing the Pencil design (`docs/playwright-rma-design.pen`) with the implemented RMA screens after PR #55 (RMA update screen). Created a 10-task plan, backlog item, and this handoff.

Communication mode: full. Branch during handoff: `develop`.

## Completed

- Created PR #55 merging `44/rma-update-screen` → `develop` with `Closes #44`.
- Created 4 backlog items from issue #44's "Further Notes" section: #56 (governed transitions), #57 (status reason & history), #58 (UI improvements), #59 (save feedback).
- Built 10-task plan for syncing Pencil design to shipped code.
- Saved plan to `docs/plans/2026-06-21_19-40-51_sync-pencil-design-to-code.md`.
- Created backlog issue #60 for the plan execution.

## Key References

| Artifact | Location / URL |
|---|---|
| Plan | `docs/plans/2026-06-21_19-40-51_sync-pencil-design-to-code.md` |
| Backlog issue | https://github.com/danilobjr/playwright-rma/issues/60 |
| PR #55 | https://github.com/danilobjr/playwright-rma/pull/55 |
| Parent PRD | https://github.com/danilobjr/playwright-rma/issues/44 |
| Pencil design | `docs/playwright-rma-design.pen` |
| Issue tracker rules | `docs/agents/issue-tracker.md` |
| Triage labels | `docs/agents/triage-labels.md` |

### Related backlog items

| # | Title | URL |
|---|---|---|
| 56 | Govern RMA status transitions | https://github.com/danilobjr/playwright-rma/issues/56 |
| 57 | Add status change reason and update history | https://github.com/danilobjr/playwright-rma/issues/57 |
| 58 | UI improvements phase | https://github.com/danilobjr/playwright-rma/issues/58 |
| 59 | Add pending save feedback | https://github.com/danilobjr/playwright-rma/issues/59 |
| 60 | Sync Pencil design with implemented code | https://github.com/danilobjr/playwright-rma/issues/60 |

## Execution Order (from plan)

1. **Foundation — Task 8**: Standardize button/input/textarea sizes (blocks downstream)
2. **Pencil-only — Tasks 1, 5, 6**: Rework popover design, remove View columns, fix date label
3. **Post-foundation — Tasks 2, 9, 10, 7**: Rich toast, merge cards, pagination, swap buttons
4. **Cards cleanup — Tasks 3, 4**: Remove Rejected card, redesign summary cards

## Uncommitted Changes

The working tree has unrelated local changes (tooling config, opencode permissions, untracked docs, test artifacts) — not part of any PR scope. See `git status --short` for current state.

## Notes For Next Agent

- Before modifying any function/class/method, run GitNexus impact analysis per `AGENTS.md`.
- Before committing, run GitNexus `detect_changes()` and ask for commit confirmation.
- User-facing static text must match approved design/PRD exactly.
- Task 8 changes propagate through many components — check all button `size` props.
- Pencil tasks (1, 5, 6) use `batch_design` tool — load the `get_guideline` for pencil editing first.
- Tests to keep green: `vitest` for unit, `npx playwright test` for E2E.

## Suggested Skills

- `pencil` / `get_guideline` for Pencil design edits (tasks 1, 5, 6).
- `shadcn` for toast component and pagination work.
- `tanstack-query` if touching RMA data hooks.
- `front-structure` for RMA UI file/component changes.
- `gitnexus-impact-analysis` before code changes.
- `playwright-best-practices` if updating E2E tests.
- `commit` for safe commit workflow.
- `create-pr` when creating the next PR.

## Sensitive Data

No secrets or credentials were present in conversation context.
