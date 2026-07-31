# Antigravity Pipeline Standard

**Status:** Canonical reference
**Applies to:** The integration pipeline that takes Documentation Engineer output and merges it into the live repository
**Owner:** Antigravity Integration
**Last updated:** 2026-07-31

This document describes the pipeline Antigravity runs after a Documentation Engineer sprint reaches `Repository Ready`. The Documentation Engineer role does not execute any step in this document — Git operations, dependency installation, linting, and builds are explicitly out of scope for that role (see `SPRINT_GENERATION_TEMPLATE.md`, Section 13). This document exists so both sides of the handoff share the same expectations.

## 1. Permanent Pipeline Sequence

```
git pull origin main
git status
pnpm install --frozen-lockfile
pnpm lint
pnpm build --webpack
git add .
git commit
git push
git rev-parse HEAD
```

Each step gates the next: a failed `pnpm lint` or `pnpm build` stops the pipeline before `git add`/`git commit`/`git push` run. Nothing is pushed to `main` that hasn't linted and built cleanly.

## 2. Expected Build Report

A pipeline run reports, at minimum:

- Node/pnpm versions used.
- `pnpm install` result (clean install from lockfile, or dependency drift detected).
- `pnpm lint` result (pass, or list of violations by file).
- `pnpm build --webpack` result (pass/fail, build duration, any warnings).
- Whether the build was a clean build or incremental.

## 3. Expected QA Report

The QA Report produced by the Documentation Engineer at the end of the sprint (per `SPRINT_GENERATION_TEMPLATE.md`, Section 10) is carried forward into the pipeline run unchanged — Antigravity does not re-derive documentation QA, it re-validates that the build/lint layer is clean on top of documentation QA that already passed.

## 4. Files Modified

The pipeline run reports the full `git status` / `git diff --stat` output: every file added, modified, or deleted since the last successful push, matching the Delivery Manifest the Documentation Engineer produced for the sprint. Any discrepancy between the Delivery Manifest and the actual `git status` output is a signal the pipeline should halt and flag rather than proceed.

## 5. Known Issues

Any lint warning, build warning, or non-blocking inconsistency that doesn't fail the pipeline but is worth surfacing (e.g. a dependency nearing end-of-support, a slow build step) is logged here rather than silently ignored.

## 6. Manual Testing Checklist

Before a sprint's content is considered fully integrated, Antigravity or a human reviewer should manually confirm:

- The new folder(s) appear correctly in the rendered sidebar navigation.
- A sample of new articles render without MDX errors.
- Internal links from the new content resolve correctly in the built site, not just in the source tree.
- No visual regression in navigation for existing modules.

## 7. Repository Updated

Confirmation that `git pull origin main` was run before any local changes were staged, and that the working tree was up to date with `origin/main` prior to commit — preventing the pipeline from committing on top of a stale base.

## 8. Build Passed

A simple pass/fail statement confirming `pnpm build --webpack` completed successfully with no blocking errors, reported alongside the Build Report in Section 2.

## 9. Commit Hash

The output of `git rev-parse HEAD` after the commit is made, recorded so the exact integrated state of the repository is traceable back to a specific sprint delivery.

## 10. GitHub Push

Confirmation that `git push` completed successfully against the remote, including the branch pushed to (expected: `main`) and any push-protection or branch-protection outcome.

## 11. Division of Responsibility

| Responsibility | Owner |
|---|---|
| Content authored per `KNOWLEDGE_OS_DOCUMENTATION_STANDARD.md` | Documentation Engineer |
| Documentation QA (frontmatter, links, meta.json, duplication, invented content) | Documentation Engineer |
| Delivery Manifest and QA Report | Documentation Engineer |
| `git pull`, `git status`, dependency install, lint, build | Antigravity |
| `git add`, `git commit`, `git push`, commit hash reporting | Antigravity |
| Manual testing checklist | Antigravity / human reviewer |

The Documentation Engineer's output ends at `Repository Ready` / `Waiting for Antigravity Integration`. Everything in this document happens after that handoff.
