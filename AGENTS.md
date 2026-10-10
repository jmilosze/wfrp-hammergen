# Agent Guidelines

- Always re-read files before making modifications to ensure you have the most up-to-date content and avoid working from stale cache.
- Always avoid using defensive fallbacks. We do not add code "just in case".
- Avoid TypeScript type assertions (such as `as any`, `as Type`, or non-null assertion `!`) that are not absolutely needed. Prefer proper type definitions, narrowing, or adjusted function signatures.
- Do not care about backwards compatibility. Never keep deprecated aliases, shims, or fallback code around for backwards compatibility.

# Project

Hammergen (https://hammergen.net) is a Warhammer Fantasy Roleplay character generator and content database for the 4th and 5th editions: a Go API (`src/api-go`, gin + MongoDB) and a Vue 3 + TypeScript frontend (`src/frontend`, Vite, Tailwind v4, Vitest). Python scripts in `db/scripts` import and fix data.

Read these before working on something non-trivial:
- `docs/architecture.md`: code layout, file organisation rules, the 4e/5e edition model and the 5e rule decisions.
- `docs/operations.md`: local servers, tests, data scripts, databases, backups, deploying.
- `docs/issues.md`: the backlog. Issues have IDs (`HG-<n>`); keep the file current when you finish or find something.

# Working rules

- **Never commit, create branches or deploy.** Leave changes uncommitted; the owner commits and deploys.
- **Ask before:** using `gcloud`, running integration tests, restarting or stopping the owner's local servers (API on :8080, Vite on :5173), and every write to staging or production data.
- Never print secrets (e.g. values from `deployment/gcp/*/config.json`).
- Take a production backup before every production data write (`docs/operations.md`).
- Plan bigger changes first: describe the plan and the decisions to make, and agree them before writing code. When a decision is genuinely the owner's, stop and ask.
- Validation stays light: basic per-field checks, no cross-reference or decision-tree validation.
- Out-of-scope bugs and ideas go into `docs/issues.md`, not into the code.
- Content descriptions must not be copied from the rulebooks; rephrase (no run of 12+ words identical to the book).

# Code conventions

- One file per topic, named with a noun; edition-specific code in `4e/`/`5e/` with the edition in the file name; large data tables in their own files. Details in `docs/architecture.md`.
- Tests are `<module>.spec.ts` next to the module. Test functions other code uses; don't export a helper just to test it.
- Frontend checks (`src/frontend`): `npx vue-tsc --noEmit`, `npx eslint src`, `npx vitest run`; format only the files you changed with `npx prettier --write`.
- Backend checks (`src/api-go`): `go test ./internal/...` (not `./...`, which runs the integration tests), `gofmt -l internal test`.

# Reference Materials

The `books/` folder contains rulebooks and errata for Warhammer Fantasy Roleplay (WFRP), with both PDF and converted plain text (`.txt`) versions available for easy reading and searching by AI agents:
- **WFRP 4th Edition**: `books/Warhammer_Fantasy_Roleplay_PDF_version4.pdf` and `books/Warhammer_Fantasy_Roleplay_PDF_version4.txt`
- **WFRP 5th Edition**: `books/WFRP5_Core_Rulebook_06_10_26.pdf` and `books/WFRP5_Core_Rulebook_06_10_26.txt` (2026-10-01 update; the older `01_09_26` version is kept for comparison)
- **WFRP Errata**: `books/WFRP_Errata_28_Feb.pdf` and `books/WFRP_Errata_28_Feb.txt`

Text extraction of tables can be garbled; `pdftotext -layout -f <page> -l <page>` on the PDF gives readable tables.
