# Handoff: Create RMA Request

## Purpose

Prepare a fresh agent to continue implementation planning or code work for the Create RMA Request flow in `playwright-rma`.

## Current State

- Repo branch during this session: `develop`.
- Caveman response mode is active until user says `stop caveman` or `normal mode`.
- User asked to discuss and specify the Create RMA Request page selected in Pencil.
- No application implementation was performed in this session.
- A domain glossary was added at `CONTEXT.md`.
- A PRD was published as GitHub issue #1.
- Vertical slice issues were published as GitHub issues #2 through #7.

## Key References

- Domain glossary: `CONTEXT.md`.
- Design artifact: `docs/playwright-rma-design.pen`.
- Selected Pencil frame: `z4KrC`, named `Screen 2 - Create RMA Request Form`.
- Prior analysis: `docs/initial-app-design-analysis.md`.
- Prior handoffs:
  - `docs/handoffs/2026-06-11_15-37-37_rma-design-to-implementation.md`
  - `docs/handoffs/2026-06-12_06-07-36_rma-web-app-overview.md`
- PRD: https://github.com/danilobjr/playwright-rma/issues/1
- Vertical slices:
  - #2: https://github.com/danilobjr/playwright-rma/issues/2
  - #3: https://github.com/danilobjr/playwright-rma/issues/3
  - #4: https://github.com/danilobjr/playwright-rma/issues/4
  - #5: https://github.com/danilobjr/playwright-rma/issues/5
  - #6: https://github.com/danilobjr/playwright-rma/issues/6
  - #7: https://github.com/danilobjr/playwright-rma/issues/7

## Repo Notes

- Current app is scaffold-only per prior analysis.
- Important existing files include router/root config, placeholder page, empty layout, and one local shadcn Button.
- Browser-only data direction was agreed: JSON seed plus localStorage-backed async service functions.
- Routes are programmatic, not file-based.
- User requested routes:
  - list: `/rma`
  - create: `/rma/create`
  - update: `/rma/[rmaId]`
- GitHub labels created during this session because missing:
  - `ready-for-agent`
  - `ready-for-human`

## Worktree Notes

- `CONTEXT.md` was created in this session.
- Earlier observed uncommitted state included modified `skills-lock.json`, untracked Playwright skill dirs, and `docs/initial-app-design-analysis.md`.
- Do not assume unrelated worktree changes belong to the next agent.
- Per repo rule, before codebase changes show current branch and ask whether to create a new branch.

## Suggested Skills

- `caveman`: user explicitly requested terse caveman style and persistence.
- `front-structure`: use before creating/moving frontend files.
- `shadcn`: use before adding UI primitives or composing shadcn components.
- `react-hook-form-zod`: use for Create RMA Request form schema and validation.
- `tanstack-router`: use for programmatic routes.
- `tanstack-query` and `tanstack-query-best-practices`: use for localStorage-backed async reads/mutations and invalidation.
- `vercel-react-best-practices`: use for React provider/page composition and performance sanity.
- `gitnexus-impact-analysis`: required before editing existing symbols per repo rules.
- `tdd`: use if implementing with tests or adding test harness.
- `diagnose`: use if Vite/shadcn/TanStack setup fails to build.

## Redactions

No secrets, API keys, passwords, credentials, or sensitive personal data were present. Mock customer names and Product IDs in design/PRD are sample data only.
