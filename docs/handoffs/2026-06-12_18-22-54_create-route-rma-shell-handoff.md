# Handoff: RMA Shell Routes

## Purpose

Prepare a fresh agent to continue work on issue #2 and follow-up cleanup for the RMA shell routing flow.

## Current State

- Branch: `2/create-route`.
- Caveman response mode is active until user says `stop caveman` or `normal mode`.
- Issue #2 implementation is split across commits on current branch.
- User manually tested navigation and confirmed it works.
- GitNexus was reported up-to-date by user before later `useLayout` API cleanup.
- No secrets, credentials, API keys, or sensitive personal data were present.

## Key References

- PRD: https://github.com/danilobjr/playwright-rma/issues/1
- Issue #2: https://github.com/danilobjr/playwright-rma/issues/2
- Design artifact: `docs/playwright-rma-design.pen`
- Domain glossary: `CONTEXT.md`
- Prior handoff: `docs/handoffs/2026-06-12_15-47-53_create-rma-request-handoff.md`
- RMA route e2e spec: `e2e/rma-routing.spec.ts`
- Layout module: `src/components/app/layout/`
- RMA pages: `src/pages/rma/`
- Router config: `src/config/router.config.tsx`

## Commits Created In This Session

- `de01046 feat(rma-pages): add RMA shell page containers`
- `e2c451f feat(comp/app/layout): add configurable app layout`
- `9a80841 feat(router): configure RMA hash routes`
- `c11d296 test(comp/app/layout): cover layout configuration`
- `a460126 test(e2e): cover RMA route navigation`
- `39d1ee6 fix(use-layout.hook): control layout sync deps`

Earlier related setup/doc commits are visible in `git log --oneline` and should be reviewed if preparing a PR.

## Verification Performed

- `pnpm test`
- `pnpm lint`
- `pnpm build`
- `pnpm test:e2e --project=chromium`
- GitNexus `detect_changes` after `useLayout` change reported HIGH risk because the hook API touches all layout callers. This was expected and all callers were updated.

## Current Worktree Notes

- `src/config/root.config.tsx` remains modified because user asked to reintroduce the existing TODO and leave it untouched afterward.
- `docs/initial-app-design-analysis.md` is untracked/unrelated and should not be assumed part of this task.
- Playwright may regenerate `test-results/.last-run.json`; do not commit it.

## Important Follow-Up Note

- The create page currently uses placeholder UI shells for Card, fields, and Alert-like regions, with only `Button` using a real shadcn component.
- User said this is acceptable for the placeholder slice, but future implementation should replace these placeholder shells with real shadcn components.
- Likely future shadcn components: `Card`, `Field`, `Input`, `Textarea`, `Alert`.
- Preserve exact Pencil copy when replacing UI.

## Suggested Skills

- `caveman`: user requested terse style with persistent mode.
- `front-structure`: use before changing page/container/layout structure.
- `shadcn`: use before replacing placeholder UI with real shadcn components.
- `react-hook-form-zod`: use when implementing Create RMA form validation.
- `tanstack-router`: use for route changes and hash-routing details.
- `tanstack-query` and `tanstack-query-best-practices`: use when adding local async data services and cache invalidation.
- `tdd`: use for future behavior changes; prefer vertical RED/GREEN slices.
- `gitnexus-impact-analysis`: required before editing existing symbols.
- `diagnose`: use if Vite, Playwright, or route setup fails.

## Redactions

No secrets, passwords, credentials, API keys, or sensitive personal data were present in this conversation. Sample RMA IDs and design text are mock/demo data.
