# Handoff: RMA Web App Overview

## Purpose

Prepare a fresh agent to continue from the current app-design and implementation overview for the minimal RMA web app.

## Current State

- Active branch during this session: `develop`.
- A concise app analysis was created at `docs/app-design-analysis.md`; use that as the canonical summary for repo state, GitNexus findings, installed stack, and architecture gaps.
- The earlier design handoff remains at `docs/handoffs/2026-06-11_15-37-37_rma-design-to-implementation.md`.
- Primary design artifact remains `docs/playwright-rma-design.pen`.

## Conversation Decisions

- Caveman response mode is frequently used by the user.
- The app should stay browser-only.
- For demo persistence, use a simple DB-like approach: JSON seed data plus localStorage-backed async service functions.
- Form stack was updated to React Hook Form + Zod validation.

## Important References

- Current summary: `docs/app-design-analysis.md`
- Design file: `docs/playwright-rma-design.pen`
- Previous handoff: `docs/handoffs/2026-06-11_15-37-37_rma-design-to-implementation.md`

## Suggested Skills

- `front-structure`: use before creating/moving frontend files to follow repo naming, suffix, and responsibility conventions.
- `shadcn`: use before adding UI primitives or composing shadcn components from the design.
- `tanstack-router`: use when replacing the placeholder router with programmatic TanStack Router routes.
- `tanstack-query` and `tanstack-query-best-practices`: use when wiring query client, hooks, mutations, and invalidation.
- `typescript-advanced-types`: use if modeling RMA status/types or form input/output types becomes non-trivial.
- `gitnexus-impact-analysis`: required before editing existing functions/classes/methods per `AGENTS.md`.
- `tdd`: use if the next session chooses test-first implementation.

## Redactions

No secrets, credentials, API keys, passwords, or sensitive personal data were present. Mock design data was not copied here.
