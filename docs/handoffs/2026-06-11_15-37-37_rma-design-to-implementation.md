# Handoff: RMA Design To Implementation

## Purpose

Prepare the next session to implement the RMA web app from the completed Pencil design.

## Current State

- Branch: `design`.
- Primary design artifact: `docs/playwright-rma-design.pen`.
- The user wants the next session to start implementation from this design.
- No commits or PRs were created in this session.

## Design Summary

The Pencil file contains a shadcn/ui-informed RMA app design with these main surfaces:

- Dashboard / RMA List.
- Create RMA Request Form.
- Update RMA Status Screen.
- Toast notification component variants.

Reference the design directly rather than recreating details from this handoff: `docs/playwright-rma-design.pen`.

## Important Design Decisions

- Visual style follows the project shadcn config: neutral palette, Geist typography, `radix-nova` feel, lucide icons, semantic shadcn component composition.
- Dashboard table uses DataTable/Table semantics with status badges and row-level delete actions.
- Dashboard filters do not apply automatically. User edits inputs, then explicitly clicks Search.
- Filter toolbar has input controls on the left and icon-only actions on the right:
  - Search icon button with tooltip `Search`.
  - Reset icon button with tooltip `Reset`.
- Table row action column uses trash icons, right aligned, with centered `Delete RMA` tooltips above each icon.
- Update Status screen includes an info icon to the left of the `Approved` badge.
- The info icon shows a hover popover containing a numbered status workflow.
- Popover workflow cards are equal height, left aligned, and use the same status icons as the Status select.
- Popover numbers are below the cards, centered under their corresponding card, connected with dashed animated left-to-right rail segments.
- Toast component variants were added:
  - Success: create/edit success.
  - Error: frontend/backend application failure.
  - Warning: invalid form information.

## Project Context

The user added shadcn MCP and project shadcn setup before this handoff. Current injected project context showed:

- Framework: Vite.
- TypeScript: enabled.
- Tailwind: v4.
- shadcn style: `radix-nova`.
- Base: `radix`.
- Icon library: `lucide`.
- UI alias: `@/components/ui`.
- Installed component before design work: `button`.

Refresh current state before implementation with `npx shadcn@latest info --json` if needed.

## Files And Worktree Notes

- Main handoff target for implementation: `docs/playwright-rma-design.pen`.
- The worktree had many existing changes from shadcn setup and app scaffolding, including files such as `components.json`, `src/components/`, `src/pages/`, `src/config/router.config.tsx`, and styling/config files.
- Do not assume all current worktree changes were made by the prior agent. Inspect before editing.
- Follow repo Git rules from `AGENTS.md`: before codebase changes, show current branch and ask whether to create a new branch, unless the user explicitly says to use the current branch.

## Suggested Skills

- `shadcn`: Use for adding/using shadcn components, checking docs, and ensuring component composition follows project rules.
- `context7-mcp`: Use when fetching current docs for Vite, React, shadcn/ui, Tailwind v4, or related libraries.
- `gitnexus-impact-analysis`: Use before modifying existing functions/classes/methods, per repo instructions.
- `tdd`: Use if implementing screens with tests or if the user wants test-first implementation.
- `diagnose`: Use if the current shadcn/Vite setup fails to build or route correctly.

## Recommended Next Steps

1. Confirm branch and whether to continue on `design` or create a new implementation branch.
2. Inspect current project structure and shadcn setup.
3. Use shadcn MCP/CLI docs before adding components such as `card`, `table`, `select`, `input`, `input-group`, `textarea`, `badge`, `field`, `sonner`, `tooltip`, and date/calendar-related components.
4. Implement the RMA routes/pages from `docs/playwright-rma-design.pen`.
5. Keep logic simple: in-memory placeholder RMA data is probably sufficient unless the user asks for persistence.
6. Run the project’s typecheck/lint/build/test commands after implementation, based on package scripts.

## Redactions

No secrets, credentials, API keys, or sensitive personal data were present in the conversation. Example customer names and product IDs are mock design data only.
