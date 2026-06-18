# Status Filter Popover Bug Handoff

## Summary

This session diagnosed and captured a backlog bug for the RMA List Status filter focus/popover regression.

Primary artifact: https://github.com/danilobjr/playwright-rma/issues/35

Use issue #35 as the source of the bug statement, repro steps, and acceptance criteria. Do not duplicate its content in future docs unless the issue changes materially.

## Current State

Repo: `/Users/danilo/repos/playwright-rma`

Branch observed: `18/rma-list-filters`

The worktree was already dirty with unrelated/user changes before this session. Do not revert them.

Related work:

- #15: PRD: RMA List Screen
- #18: RMA List Filters
- #35: Fix Status filter popover focus regression on RMA List

## Diagnosis So Far

Likely root cause: Radix Select hides all DOM except the portaled listbox with `hideOthers(content)`. After option selection, Radix refocuses the trigger. On second open, the focused trigger remains inside `<main>` while Radix tries to apply `aria-hidden` to `<main>`, causing the browser warning and a broken/invisible popup.

Evidence gathered:

- Local `@radix-ui/react-select@2.3.0` source shows `hideOthers(content)` in `SelectContentImpl`.
- Same source restores focus to the trigger on close.
- The app Status trigger lives inside `<main>`.
- The reported warning names the focused trigger and the `main` ancestor.

Relevant files:

- `src/pages/rma/list/rma-list.page.tsx`
- `src/components/ui/select/select.ui.tsx`
- `e2e/rma-list.spec.ts`
- `src/pages/rma/list/rma-list.page.test.tsx`

## GitNexus Impact Already Run

Impact before possible edits:

- `RmaListPage`: LOW risk, 1 direct consumer.
- `SelectTrigger`: LOW risk, 2 impacted symbols, 1 affected flow.
- `SelectContent`: LOW risk, 2 impacted symbols, 1 affected flow.

If a fresh session edits these or related symbols, rerun GitNexus impact per repo instructions.

## Playwright MCP Status

Live repro through Playwright MCP was attempted but blocked by browser setup.

First MCP error:

```text
Chromium distribution 'chrome' is not found at /Applications/Google Chrome.app/Contents/MacOS/Google Chrome
```

Cached Playwright browsers found under `~/Library/Caches/ms-playwright`:

- `chromium-1223/.../Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`
- `chromium_headless_shell-1223/.../chrome-headless-shell`
- `firefox-1522/.../firefox`
- `webkit-2287/.../Playwright`

Later MCP error:

```text
Browser "chrome-for-testing" is not installed. Run `npx @playwright/mcp install-browser chrome-for-testing` to install
```

Important distinction: `playwright.config.ts` already uses cached Playwright Chromium for normal e2e tests. MCP browser launch is separate and was not controlled by that config.

## Suggested Next Steps

1. Fix or route Playwright MCP to a usable Chrome for Testing install, or run `npx @playwright/mcp install-browser chrome-for-testing` if allowed.
2. Start or reuse the Vite dev server.
3. Reproduce issue through MCP and capture console plus DOM/accessibility evidence.
4. If implementing the fix, confirm branch/new branch per repo git rules before edits.
5. Add regression coverage for open/select/reopen and absence of the `aria-hidden` warning.
6. Fix minimally while preserving Status copy, option order, and filtering semantics.
7. Run relevant tests.
8. Run GitNexus `detect_changes()` before any commit.

## Suggested Skills

- `diagnose` — continue repro-first debugging loop.
- `playwright-best-practices` — add robust e2e regression without flaky selectors.
- `gitnexus-impact-analysis` — rerun before edits.
- `front-structure` — use if moving or creating frontend files.
- `commit` — use only if the user asks to commit.

## Constraints And Notes

User prefers terse "smart caveman" responses until they say `stop caveman` or `normal mode`.

Do not commit or create PR without confirmation.

No secrets or credentials were captured.
