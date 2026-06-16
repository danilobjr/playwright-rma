---
name: create-pr
description: Guides safe GitHub PR creation with scope discovery, branch/base validation, related-file review, title formatting, labels, assignee, and issue-closing keywords. Use when user asks to create a PR, prepare a PR, split PRs, open a pull request, or decide PR scope.
---

# Create PR

## Quick Start

Ask user for PR scope. Explain scope means the coherent work this PR should include, not commit message scope.

Inspect state before proposing anything:

```sh
git branch --show-current
git status --short
git log --oneline <base>..HEAD
git diff --stat <base>...HEAD
```

## Scope Review

Infer related files and commits from user scope, current branch, diff paths, commit messages, issues, and session context.

If unrelated files or commits exist, recommend split PRs. Do not include unrelated work silently. Check whether untracked/unstaged files should stay excluded or need their own PR.

## Base Branch

Merge current branch into its base branch. Determine base using upstream, fork-point, merge-base, branch naming, or user confirmation. If unsure, ask.

## Title

If `.agents/skills/commit/SKILL.md` exists, format PR title like commit skill headers:

```txt
<emoji> <type>(optional-scope): <subject>
```

Tell user title follows commit-skill pattern. If commit skill is absent, use clear plain text.

## Labels And Assignee

Assign PR to current GitHub user:

```sh
gh api user --jq .login
```

List repo labels and pick proper labels for the scope. Common mapping:

- Issue feature or UI/UX polish: `enhancement`, `ready-for-human`
- Docs or skills: `documentation`, `ready-for-human`
- Bug fix: `bug`, `ready-for-human`

Ask if label choice is unclear.

## Issue Linking

If PR scope relates to an issue or similar tracker item, ask which keyword to use:

- `Close`, `Closes`, `Closed`
- `Fix`, `Fixes`, `Fixed`
- `Resolve`, `Resolves`, `Resolved`

Add selected keyword plus item number to PR body.

## PR Plan

Before creating PR, present:

- Base branch.
- Head branch.
- Title and note whether commit-skill pattern was used.
- Assignee.
- Labels.
- Included commits and files.
- Excluded commits and files.
- Body draft, including issue-closing line if applicable.

Create PR only after user approval.

## Execution

After approval:

1. Push branch if needed.
2. Create PR with `gh pr create`.
3. Verify metadata with `gh pr view`.
4. Return PR URL.
