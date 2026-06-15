# Handoff: Front Structure UI Refactor

## Purpose

Continue UI component structure/refactor work in `danilobjr/playwright-rma` after a long session focused on codifying conventions in `front-structure` and applying them to `Button` and `Card`.

## Current State

- Branch: `3/create-pending-rma`.
- Response style: caveman mode active until user says `stop caveman` or `normal mode`.
- Active pattern: when user says “take a look at a refactor,” infer the intended rule for `.agents/skills/front-structure/SKILL.md`; do not edit unless user says proceed.
- Current worktree at handoff time:
  - `M src/components/ui/card/card.ui.tsx` is user/uncommitted work after the latest Card commit.
  - `?? src/components/ui/card_COPY.tsx` is a backup. Do not touch unless user explicitly asks.
  - `?? docs/handoffs/2026-06-14_01-44-58_issue-3-create-pending-rma-request_BACKUP_COPY.md` is user backup. Do not touch unless requested.
  - `?? docs/initial-app-design-analysis.md` is unrelated/untracked. Do not touch unless requested.

## What Was Done

Do not duplicate diffs; inspect commits for exact changes.

- `front-structure` skill was repeatedly updated in `.agents/skills/front-structure/SKILL.md` to capture UI conventions.
- `Button` was refactored into folder/component-family conventions under `src/components/ui/button/`.
- Shared `AsChildProp` was added under `src/components/shared/types/as-child-prop.type.ts`.
- `Card` was refactored from flat `src/components/ui/card.tsx` into `src/components/ui/card/` with:
  - `card.ui.tsx`
  - `card.styles.ts`
  - `index.ts`
- `src/components/ui/card_COPY.tsx` was intentionally left untouched as backup.

## Recent Relevant Commits

- `75fcc5c docs(skills/front-structure): allow component families`
- `45a24ed refactor(comp/ui/card): apply folder and style conventions`
- `60b135f docs(skills/front-structure): define tailwind style formatting`
- `f801015 refactor(comp/ui/button): format tailwind variants`
- `e152acd docs(skills/front-structure): define component prop ordering`
- `b4e3b5e docs(skills/front-structure): define jsx prop conventions`
- `f142764 refactor(comp/ui/button): apply jsx prop conventions`
- `bac6d8c docs(skills/front-structure): define shared component types`
- `12fce05 refactor(comp/ui/button): use shared as-child prop type`

Use `git log --oneline -20` for full sequence.

## Important Conventions Now Captured

Reference `.agents/skills/front-structure/SKILL.md` as source of truth. Highlights:

- UI component folders: `src/components/ui/<component>/` with `<component>.ui.tsx`, `<component>.styles.ts`, `index.ts`.
- Tightly-coupled component families can live in one `.ui.tsx` file.
- Component families should have one style variant builder per exported component/subcomponent.
- Components with props must use named `ComponentNameProps`; no inline prop annotations.
- Props type exports come before runtime exports.
- Destructured rest props use `otherProps`; non-destructured object can be `props`.
- JSX prop order: `className`, sorted `className*`, `data-slot`, remaining props, spread.
- `className` must be passed to `cn(...)`, not into `cva(...)` variant args.
- Multi-class Tailwind style values use multiline template literals, one class per line.
- Shared cross-component prop types live in `src/components/shared/types`.

## Current Uncommitted Card Change

There is an uncommitted change in `src/components/ui/card/card.ui.tsx`. Inspect it with:

```bash
git diff -- src/components/ui/card/card.ui.tsx
```

At handoff time it appears to move each `Card*Props` type closer to its component and compress some JSX return elements/export list to one line. Confirm with the user whether this is intended as a new `front-structure` rule before changing skill or committing.

## Verification Performed

- After Card folder refactor, `pnpm build` passed.
- After Card folder refactor, `pnpm lint` passed.
- GitNexus pre-edit impact for Card family returned HIGH due RMA create/list consumers; this was expected for shared UI components.
- GitNexus `detect_changes` can miss untracked new folders before staging; rely on `git status` and build/lint too.

## Suggested Skills

- `front-structure`: required for continued UI component/folder convention work.
- `gitnexus-impact-analysis`: required before editing symbols such as `Card`, `CardHeader`, `CardContent`, etc.
- `vercel-react-best-practices`: useful for React component refactors/import patterns.
- `shadcn`: useful if touching generated UI primitives or registry-style components.
- `typescript-advanced-types`: useful for component props/types and `VariantProps` work.

## Next Steps

- Ask user whether the current `card.ui.tsx` diff is meant to become another `front-structure` rule.
- If yes, infer rule, update `.agents/skills/front-structure/SKILL.md`, commit separately.
- Then apply/commit `src/components/ui/card/card.ui.tsx` if requested.
- Do not touch `src/components/ui/card_COPY.tsx`.
- Before committing, run `gitnexus_detect_changes({ scope: "all", repo: "playwright-rma" })`; run `pnpm build` and `pnpm lint` for component changes.

## Redactions

No secrets, API keys, passwords, credentials, or sensitive personal data were present in this session.
