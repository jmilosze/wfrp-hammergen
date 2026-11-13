# Agent Guidelines

- Always re-read files before making modifications to ensure you have the most up-to-date content and avoid working from stale cache.
- Always avoid using defensive fallbacks. We do not add code "just in case".
- Avoid TypeScript type assertions (such as `as any`, `as Type`, or non-null assertion `!`) that are not absolutely needed. Prefer proper type definitions, narrowing, or adjusted function signatures.
- Do not care about backwards compatibility. Never keep deprecated aliases, shims, or fallback code around for backwards compatibility.
- Comment only when necessary: the why (rulebook page references, decision tags, non-obvious constraints), never what the code does. No file headers or paragraphs narrating the code, even where nearby code has them; when changing code, remove or fix the comments it makes stale.

# Project

Hammergen (https://hammergen.net) is a Warhammer Fantasy Roleplay character generator and content database for the 4th and 5th editions: a Go API (`src/api-go`, gin + MongoDB) and a Vue 3 + TypeScript frontend (`src/frontend`, Vite, Tailwind v4, Vitest). Python scripts in `db/scripts` import and fix data.

Read these before working on something non-trivial:
- `docs/architecture.md`: code layout, file organisation rules, the 4e/5e edition model and the 5e rule decisions.
- `docs/operations.md`: local servers, tests, data scripts, databases, backups, deploying.
- `docs/issues/`: the backlog, split into `functional.md`, `ui.md` and `technical.md` (rules and the next free ID in `README.md`). Issues have IDs (`HG-<n>`); keep the files current when you finish or find something.

# Working rules

- **Never commit, create branches or deploy.** Leave changes uncommitted; the owner commits and deploys.
- **Ask before:** using `gcloud`, running integration tests, restarting or stopping the owner's local servers (API on :8080, Vite on :5173), and every write to staging or production data.
- Never print secrets (e.g. values from `deployment/gcp/*/config.json`).
- **Every data import, data fix and data a deploy needs follows "Changing data: required procedure" in `docs/operations.md`**: local first (start MongoDB if it isn't running), with the type check (`go run ./cmd/checkdata`) and the API checks passing locally before staging or production is touched; the same checks after each environment; a production backup before the production write.
- Plan bigger changes first: describe the plan and the decisions to make, and agree them before writing code. When a decision is genuinely the owner's, stop and ask.
- Validation stays light: basic per-field checks, no cross-reference or decision-tree validation.
- Out-of-scope bugs and ideas go into `docs/issues/`, not into the code.
- Content descriptions (skills, talents, spells, items and the like) are brief and mechanics only: no flavour, no completeness. Keep the most important rules and point to the book page for details (tables, costs, lists). Never copy from the rulebooks; always rephrase (no run of 12+ words identical to the book).

# Delegation

The main session orchestrates. You may delegate without being asked to the cheaper subagents in `.claude/agents/` when a task is self-contained and needs little judgement:
- `checker` (Haiku): run the frontend/backend checks after code changes and get back only the failures.
- `book-lookup` (Haiku): find rules, tables and entries in `books/`.
- `data-compare` (Sonnet): compare database records with the books in data reviews.
- `Explore` (built-in): broad searches across the codebase.

Keep in the main session: design and rule decisions, code and data edits, anything touching staging or production, and anything the owner has to approve. Check a subagent's result before relying on it; don't delegate a task that is quicker to do directly.

# Code conventions

- One file per topic, named with a noun; edition-specific code in `4e/`/`5e/` with the edition in the file name; large data tables in their own files. Details in `docs/architecture.md`.
- Tests are `<module>.spec.ts` next to the module. Test functions other code uses; don't export a helper just to test it.
- Frontend checks (`src/frontend`): `npx vue-tsc --noEmit`, `npx eslint src`, `npx vitest run`; format only the files you changed with `npx prettier --write`.
- Backend checks (`src/api-go`): `go test ./internal/...` (not `./...`, which runs the integration tests), `gofmt -l internal test`.

# Reference Materials

The `books/` folder contains rulebooks and errata for Warhammer Fantasy Roleplay (WFRP), with both PDF and converted plain text (`.txt`) versions available for easy reading and searching by AI agents:
- **WFRP 4th Edition**: `books/4ed/wfrp/Warhammer_Fantasy_Roleplay_PDF_version4.pdf` and `.txt`
- **WFRP 5th Edition**: `books/5ed/WFRP_5th_ed/WFRP5_Core_Rulebook_06_10_26.pdf` and `.txt` (2026-10-01 update; the older `01_09_26` version is kept for comparison)
- **WFRP Errata**: `books/4ed/wfrp/WFRP_Errata_28_Feb.pdf` and `.txt`
- **4e supplements**: PDFs only, in `books/4ed/<book>/` and directly in `books/4ed/`

Text extraction of tables can be garbled; `pdftotext -layout -f <page> -l <page>` on the PDF gives readable tables.
