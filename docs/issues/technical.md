# Technical issues

Everything users don't see directly: backend internals, code quality, tests, tooling, deployment, performance, analytics. Rules and the next free ID are in [README.md](README.md).

## Bugs

### HG-21 `deploy.py` turns maintenance off
Tooling · 2026-09-30

`deployment/gcp/deploy.py` uses `--set-env-vars`, which replaces all Cloud Run env vars and so drops `HAMMERGEN_MAINTENANCE_ENABLED`. Use `--update-env-vars` or add the flag to the config.

### HG-22 `make dev-restart` / `make test` delete local data
Tooling · 2026-09-30

They run `docker compose down -v`, which deletes the local MongoDB volume (and the `hammergenGo` dev data).

## Improvements

### HG-2 Usage metrics per edition (4e vs 5e)
Feature · 2026-10-07

Measure how much each edition is used: content browsing and search, custom content, characters created/viewed/edited/printed, the "Allow 4e content" switch, generator runs; plus a report. Decided approach: API-side structured events (via the existing `slog` → Cloud Logging, then log-based metrics or BigQuery), possibly complemented by counts from the database. Open points: client-only actions (print, CSV export) never reach the API (accept, or add a small event endpoint); some requests don't carry the edition (resolve it from the entity); log counts/edition/action only, no personal data. No 4e baseline was taken before 5e launched.

### HG-4 Survey user data
Feature · 2026-10-10

How many characters use Gnome/Ogre/regional species, Resilience/Resolve, runes and supplement content. Input for deciding what to convert to 5e next.

### HG-10 Explicit validation instead of struct tags
Backend · 2026-10-01

Move away from tag-based validation (`go-playground/validator`) to explicit per-type validation. Tags only check single fields, so invalid combinations get through, e.g. a 4e talent with `maxRank` 0 and both `attribute` and `attribute2` empty. Cross-field rules currently live in ad-hoc places (`extraCharacterValidation`, `ValidateEdition`). Keep validation light: basic checks only, no cross-reference or decision-tree validation.

### HG-11 Rework how modifiers work
Backend + Frontend · 2026-10-01

Talents, traits and mutations share one `modifiers` block (size, movement, characteristics, effects). Everything that doesn't fit the linear "per take" numbers is a hard-coded effect (Hardy, Strong Back, Sturdy) with its own calculation, and the effect enum and per-edition lists are duplicated in Go and TypeScript. Non-linear effects (Strong Back) and effects Hammergen doesn't model (Luck/Fortune, Fear) show the limits.

### HG-13 `go vet` warnings
Backend · 2026-09-30

Unkeyed `bson.E` struct literals in `internal/dependencies/mongodb/user.go`.

### HG-17 Two `validAttributesFn`
Frontend · 2026-10-09

`services/wh/core/validators.ts` (field name in the message, used by characters) and `services/wh/core/attributes.ts` (used by modifiers) do the same check with different signatures and messages; keep one.

### HG-19 Test fixtures cast with `as …ApiData`
Frontend · 2026-09-30

`content/skill.spec.ts` and `content/career.spec.ts` cast fixtures, which hides type errors (e.g. a stale `visibility` field went unnoticed).

### HG-23 Obsolete `version` in `docker-compose.yaml`
Tooling · 2026-09-30

Compose warns about the obsolete `version` attribute; remove it.

### HG-24 HTTP integration tests only cover properties
Tests · 2026-09-30

`src/api-go/test/integration` only covers qualities/flaws; add other content types and characters. Note: these tests run against the `wfrp-mongodb` container on :8081, which writes to the local `hammergenGo` database.

## Ideas

### HG-32 Cache content lists for the session
Frontend · 2026-10-15

Every visit to a list page, and every opening of an editor, fetches the content lists again (the 5e character editor up to 16 lists plus generation data). Idea: a shared store per content type and edition that `useWhList` reads through, with one request shared by simultaneous callers. Drop a type (both editions) on save, copy and delete, and everything on login/logout (lists depend on the user). Changes from other tabs or linked accounts then show only after a reload; a stale-while-revalidate variant keeps data fresh but saves no requests. Cached entries are shared mutable models, so pages must not change them (`copyWh` pushes into the list today). Measure first (load time and size of the trappings list, opening a 5e character with 4e content) and decide whether it is worth it.

### HG-35 Decide on end-to-end tests (Playwright)
Tests · 2026-10-15

Decide whether to add a few Playwright smoke tests against the local stack: log in, create/save/delete content, generate/save/view a character, the print view. They would replace the manual browser checks done after UI changes and are the only tests that cover real dialogs, CSS and the real API. Costs: the API and MongoDB (with test data and a test account) must run during the tests, the tests are slower and flakier than unit and component tests, and CI would need the same setup. Component tests (Vitest, happy-dom) already cover component logic.
