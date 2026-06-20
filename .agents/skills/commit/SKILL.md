---
name: commit
description: Guides safe git commit preparation with branch confirmation, commit segregation, and repo commitlint message patterns. Use when user asks to commit, prepare commits, write commit messages, split staged changes, or create a commit plan.
---

# Commit

## Quick Start

When user asks to commit, never commit immediately. First inspect state, ask branch intent, then present commit plan.

```sh
git branch --show-current
git status --short
git diff
git log --oneline -10
```

Ask: `Commit on current branch?` If user says no, offer to create a new branch from current branch before continuing.

## Hard Rules

- Never commit directly, even in build mode.
- Always present commit plan first.
- If user asks to update plan, present a new plan before any commit.
- Never stage unrelated or user-owned changes.
- Never amend unless user explicitly asks.
- Run `gitnexus_detect_changes()` before commit when repo GitNexus rules require it.
- If working tree has unrelated dirty files, call them out and exclude them from staging.

## Commit Segregation

Propose separate commits when changes span different concerns: product code vs tests, source vs tooling/config, docs vs runtime behavior, or multiple independent features/fixes.
Keep one commit when changes are one coherent slice and separation would reduce clarity.

## Commit Message Pattern

Messages must match repo commitlint rules from `commitlint.config.mjs`.

Format:

```txt
<emoji> <type>(optional-scope): <subject>
```

Header regex:

```txt
^(✨|🐞|🔧|🚧|📝|💄|🧪|🚀|📦)\s+(\w+)(?:\(([^)]+)\))?(!)?: (.+)$
```

Allowed types: `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`, `perf`, `build`.

Emoji map:

- `✨ feat` = new feature
- `🐞 fix` = bug fix
- `🔧 refactor` = code change that neither fixes bug nor adds feature
- `🚧 chore` = other changes that do not modify src or test files
- `📝 docs` = docs-only changes
- `💄 style` = code style only, not app UI/UX design
- `🧪 test` = add or correct tests
- `🚀 perf` = performance improvement
- `📦 build` = build system or dependency changes

Subject rules:

Required, 10-72 chars, no trailing period. Type lowercase. Scope optional. Header max 100 chars. Body lines max 100 chars.

## Plan Template

Present plan before staging or committing:

```md
Commit plan:
1. Commit: `🚧 chore(rma): polish create request layout`
   Files: `src/pages/rma/create/rma-create.page.tsx`, ...
   Reason: responsive UI polish.

2. Commit: `🧪 test(rma): cover responsive create layout`
   Files: `e2e/rma-create.spec.ts`, ...
   Reason: responsive acceptance coverage.

Excluded files:
- `path/to/unrelated-file`

Verification:
`pnpm lint`, `pnpm build`, `pnpm test:e2e --project=chromium`

Proceed with this plan?
```

## Commit Execution

After user approves plan:

1. Stage only planned files with explicit paths.
2. Run required verification if not already current.
3. Run GitNexus change detection if required.
4. Commit using planned message.
5. Report commit hash and files committed.
