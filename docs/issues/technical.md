# Technical issues

Everything users don't see directly: backend internals, code quality, tests, tooling, deployment, performance, analytics. Rules and the next free ID are in [README.md](README.md).

## Bugs

### HG-21 `deploy.py` turns maintenance off
Tooling · 2026-09-30

`deployment/gcp/deploy.py` uses `--set-env-vars`, which replaces all Cloud Run env vars and so drops `HAMMERGEN_MAINTENANCE_ENABLED`. Use `--update-env-vars` or add the flag to the config.

### HG-22 `make dev-restart` / `make test` delete local data
Tooling · 2026-09-30

They run `docker compose down -v`, which deletes the local MongoDB volume (and the `hammergenGo` dev data).

### HG-46 Password reset token sent to Google Analytics
Frontend · 2026-10-16

The reset link from the e-mail opens `/resetpassword/:token` with a full page load, and the gtag config in `index.html` sends the full URL as the page view, so the reset token ends up in Google Analytics. Strip it from what is sent (fixed by HG-45 if page views are sent with the route path template; otherwise exclude that page).

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

### HG-45 Page breakdown in Google Analytics
Frontend · 2026-10-16

Google Analytics (gtag in `index.html`, `VITE_ANALYTICS_ID`) only runs its default config, so per-page reports are poor: every page has the title "Hammergen", and URLs carry ids (`/character/<id>`, `/career/<id>`) and list filter queries, so one page splits into thousands of rows. Goal: see how often each page is used (e.g. characters list, character editor, career view, generator). Send page views from the router (`router.afterEach` in `router.ts`) with the route name as title and the path template (`/character/:id`) as location, with `send_page_view: false` and the history page views of Enhanced Measurement turned off so nothing is counted twice; optionally the edition as a parameter (custom dimension set up in GA by the owner). Optional events for actions without their own page (generate, print, CSV export). No ids or personal data in what is sent. Complements HG-2 (API-side usage metrics).

### HG-47 Count character CSV/JSON downloads
Frontend · 2026-10-16

Character downloads (`download` in `components/character/sheet/ViewCharacterHeader.vue`) are built in the browser and saved with `saveAs`, so they never reach the API and Google Analytics' automatic `file_download` (link clicks to files only) doesn't see them. Send a GA event from `download`, e.g. `character_download` with the format (`csv`/`json`) and the edition, and the same for Print. GA is enough for usage trends; it undercounts users with ad blockers. Only if exact numbers are needed, add a small API event endpoint instead (the open point in HG-2). Do it together with HG-45 (one place that sends GA events).

### HG-48 Review the authentication system
Backend + Frontend · 2026-10-16

Review authentication and account handling end to end and file what is found as separate issues. Today: `POST api/token` returns an HMAC-signed JWT (`dependencies/golangjwt/jwt.go`) carrying the user id, admin flag and shared account ids; passwords are bcrypt hashes (`services/user.go`); reCAPTCHA guards registration and the reset e-mail; the reset link carries a reset JWT (rejected as an access token by `RequireJwt`); the frontend keeps the token and the decoded claims in `localStorage` (`services/auth.ts`). Points to check, among others:
- Token lifetime and no refresh: access tokens last 7 days (`HAMMERGEN_JWT_ACCESS_EXPIRY`) and are not refreshed, so even an active user logs in again weekly. When a request gets a 401, `SessionLoginDialog` asks for the password and sends the request again, so unsaved edits survive; logging out from it goes to the login page as before. Claims (admin, linked accounts) stay stale until expiry; logout only clears the browser, the token stays valid. Opening the app with an expired token shows either the dialog or the login page, depending on whether the page's own requests or the session check in `App.vue` (which logs out silently) get their 401 first.
- Reset tokens can be used again until they expire, also after the password was changed (HG-46: they also leak to Google Analytics).
- Token in `localStorage` (readable by any script on the page) vs an httpOnly cookie.
- Brute-force and enumeration: the API has no rate limit (check whether anything in front of Cloud Run has one), so `api/token` can be tried freely; `api/user/exists/:userName` and the reset endpoint reveal whether a user exists.
- Password rules, bcrypt cost, HMAC secret strength and rotation.
- Authorisation of the user endpoints (`dependencies/gin/user.go`): who may read, update, change claims of or delete which user.

## Ideas

### HG-32 Cache content lists for the session
Frontend · 2026-10-15

Every visit to a list page, and every opening of an editor, fetches the content lists again (the 5e character editor up to 16 lists plus generation data). Idea: a shared store per content type and edition that `useWhList` reads through, with one request shared by simultaneous callers. Drop a type (both editions) on save, copy and delete, and everything on login/logout (lists depend on the user). Changes from other tabs or linked accounts then show only after a reload; a stale-while-revalidate variant keeps data fresh but saves no requests. Cached entries are shared mutable models, so pages must not change them (`copyWh` pushes into the list today). Measure first (load time and size of the trappings list, opening a 5e character with 4e content) and decide whether it is worth it.

### HG-35 Decide on end-to-end tests (Playwright)
Tests · 2026-10-15

Decide whether to add a few Playwright smoke tests against the local stack: log in, create/save/delete content, generate/save/view a character, the print view. They would replace the manual browser checks done after UI changes and are the only tests that cover real dialogs, CSS and the real API. Costs: the API and MongoDB (with test data and a test account) must run during the tests, the tests are slower and flakier than unit and component tests, and CI would need the same setup. Component tests (Vitest, happy-dom) already cover component logic.
