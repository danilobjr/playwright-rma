<!-- gitnexus:start -->

# GitNexus — Code Intelligence

This project is indexed by GitNexus as **playwright-rma** (18 symbols, 9 relationships, 0 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> Index stale? Run `node .gitnexus/run.cjs analyze` from the project root — it auto-selects an available runner. No `.gitnexus/run.cjs` yet? `npx gitnexus analyze` (npm 11 crash → `npm i -g gitnexus`; #1939).

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows. For regression review, compare against the default branch: `detect_changes({scope: "compare", base_ref: "main"})`.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `rename` which understands the call graph.
- NEVER commit changes without running `detect_changes()` to check affected scope.

## Resources

| Resource                                        | Use for                                  |
| ----------------------------------------------- | ---------------------------------------- |
| `gitnexus://repo/playwright-rma/context`        | Codebase overview, check index freshness |
| `gitnexus://repo/playwright-rma/clusters`       | All functional areas                     |
| `gitnexus://repo/playwright-rma/processes`      | All execution flows                      |
| `gitnexus://repo/playwright-rma/process/{name}` | Step-by-step execution trace             |

## CLI

| Task                                         | Read this skill file                                        |
| -------------------------------------------- | ----------------------------------------------------------- |
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md`       |
| Blast radius / "What breaks if I change X?"  | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?"             | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md`       |
| Rename / extract / split / refactor          | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md`     |
| Tools, resources, schema reference           | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md`           |
| Index, status, clean, wiki CLI commands      | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md`             |

<!-- gitnexus:end -->

## Git operation rules

### Always Do

- Before starting any codebase changes, show the current branch and ask: "Do you want to create a new branch?" If Yes (or similar), create the new branch from the current one. If No (or similar), stop and wait for a new prompt.

### Never Do

- NEVER commit without confirmation.
- NEVER create a PR on GitHub without confirmation.

## Handoff File Rules

When using handoff skill: `./.agents/skills/handoff/SKILL.md`.

1. Create the handoff file first in the OS temporary directory.
2. Then move that file into `./docs/handoffs/` before finishing.
3. Final response must report the final workspace path, not the temporary path.
4. Use file name format `YYYY-MM-DD_HH-MM-SS_[SESSION_NAME].md`, where `SESSION_NAME` is lowercase, dash-separated, and has no punctuation.

## Design Text Rules

- All user-facing static text must match the approved design exactly.
- Do not invent titles, descriptions, labels, helper text, empty states, or button copy when a design exists.
- Dynamic data text may interpolate runtime values into the design copy pattern.
- If design text is missing or ambiguous, inspect the design artifact first; ask the user before adding new copy.

## Agent skills

### Issue tracker

Issues and PRDs are tracked in GitHub Issues for `danilobjr/playwright-rma`. See `docs/agents/issue-tracker.md`.

### Triage labels

Triage labels use the canonical mattpocock/skills vocabulary. See `docs/agents/triage-labels.md`.

### Domain docs

Domain docs use a single-context layout. See `docs/agents/domain.md`.
