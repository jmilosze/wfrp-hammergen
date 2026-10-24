# Technical issues

Everything users don't see directly: backend internals, code quality, tests, tooling, deployment, performance, analytics. Rules and the next free ID are in [README.md](README.md).

## Bugs

## Improvements

### HG-50 Reduce data transfer between the API and Atlas
Backend + Frontend · 2026-10-19

On 2026-10-19 from about 15:25 UTC production slowed to 2–8 s per request: Cloud Run was idle, but responses came from Atlas at about 60 KB/s (`item?edition=4e`, 504 KB: 8.1 s). The API had read about 9.9 GB from Atlas in the previous 7 days (Cloud Run `received_bytes`), rising from 0.7–1.0 GB/day in early October to 1.3–2.0 GB/day; the free tier (M0) throttles after 10 GB per rolling 7 days. The owner upgraded the cluster (now a Flex tier) at about 15:59; the API instances started before the upgrade kept failing (no primary, TLS errors to one node) until a new Cloud Run revision restarted them at 16:10. After that the same request took 0.35 s. Lesson: restart the Cloud Run instances after an Atlas tier change.

Flex has no transfer limit (flat $8/month up to 100 ops/s), but Cloud Run egress (about 20 GB/month, $2–3) and load times grow with usage. Done on 2026-10-19 (not deployed yet): lists with an edition fetch only that edition's variant from MongoDB; the API gzips responses over 1 KB (`item?edition=4e` 505 KB → 63 KB); `ownerid` and `visibility` indexes on every content collection, created at startup when `HAMMERGEN_MONGODB_CREATE_WH_INDEXES` is on. Still to do:
- Public content is effectively static: serve it as static JSON from Firebase Hosting (one file per type and edition with a content hash, plus a manifest), exported from the database by a publish step; the frontend merges it with the user's own and shared content from the API ("own only" list mode). Open decision: plain publish step, or a static baseline plus public documents modified since the export (deleted public documents then wait for the next publish). The API keeps public content in memory for its own needs (`full=true`, generation data, career filters). If agreed, this replaces the caching plan of HG-32.
- Alert on the 7-day sum of Cloud Run `container/network/received_bytes_count`, or set an Atlas alert on network bytes out.

### HG-51 Expire old logs in BigQuery
Deployment · 2026-10-19

The log sink `logs-to-big-query` copies all production Cloud Run logs into the BigQuery dataset `hammergen_logs` (location US). Nothing ever expires: on 2026-10-19 it held 4.0 GB (`run_googleapis_com_requests` 2.7 GB, `run_googleapis_com_stdout` 1.3 GB) in daily partitions back to 2024-11-24. BigQuery storage is free up to 10 GB, and the growth speeds up with traffic. Set a partition expiration on the dataset (default for new tables) and on the existing tables, e.g. `bq update --default_partition_expiration <seconds>` and `bq update --time_partitioning_expiration <seconds>` per table. Expiration deletes old partitions for good, so pick the retention first (e.g. 90 or 365 days): HG-2 may use these logs for usage metrics, so keep enough history for that or aggregate it into its own table before old partitions expire.

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


### HG-24 HTTP integration tests only cover properties
Tests · 2026-09-30

`src/api-go/test/integration` only covers qualities/flaws; add other content types and characters. Note: `make test` runs them against their own throwaway stack on :8083.

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
- Reset tokens can be used again until they expire, also after the password was changed.
- Token in `localStorage` (readable by any script on the page) vs an httpOnly cookie.
- Brute-force and enumeration: the API has no rate limit (check whether anything in front of Cloud Run has one), so `api/token` can be tried freely; `api/user/exists/:userName` and the reset endpoint reveal whether a user exists.
- Password rules, bcrypt cost, HMAC secret strength and rotation.
- Authorisation of the user endpoints (`dependencies/gin/user.go`): who may read, update, change claims of or delete which user.

### HG-32 Cache public content on the frontend
Frontend + Backend · 2026-10-15, agreed 2026-10-18

Every visit to a list page, and every opening of an editor, fetches whole content lists again from the API and MongoDB (the 5e character editor up to 16 lists plus generation data). Public content (the compendium) is the same for every user and changes only when the admin edits it or a data script runs, and HG-40 adds about 95 trappings to the largest list. Cache it on the frontend instead of querying it every time:
- The list endpoints return public, own and shared documents together (`WhService.Get`), so the public part needs its own request (e.g. a visibility filter), and the user's own and shared content is fetched separately and merged (small, and it changes with login/logout and saves).
- Cache per content type and edition, in memory for the session and possibly in IndexedDB across visits; one request shared by simultaneous callers (`useWhList`, the editors, the generator).
- Invalidation: a version of the public content (e.g. a counter or the latest `modifiedOn` per type, served by a cheap endpoint or with the generation data) that the frontend checks on start; admin saves and data scripts change it. Drop a type on the admin's own save, copy and delete.
- Cached entries are shared mutable models, so pages must not change them (`copyWh` pushes into the list today).
- Measure before and after: load time and size of the trappings list, opening a 5e character with 4e content.

### HG-56 Replace Mailjet as the email provider
Backend + Deployment · 2026-10-24

The API sends its only email, the password reset link (`UserService` in `internal/services/user.go`), through Mailjet (`internal/dependencies/mailjet/email.go`, selected by the `Email` config value `mailjet`). Mailjet saves every recipient as a contact, and the free tier allows only a small number of contacts, so the limit fills up with users who once reset their password. Move to a transactional email provider whose free tier doesn't keep or cap recipients: add an implementation of `domain.EmailService` for it, switch the config, delete the Mailjet package and the `mailjet-apiv3-go` dependency, and set up the sender domain (SPF/DKIM) and the API keys in the deployment config. Pick the provider first (free volume, sender verification, Go client or plain HTTP API). While there: `NewEmailService` never sets `FromName`, so emails go out with an empty sender name.

## Ideas

### HG-35 Decide on end-to-end tests (Playwright)
Tests · 2026-10-15

Decide whether to add a few Playwright smoke tests against the local stack: log in, create/save/delete content, generate/save/view a character, the print view. They would replace the manual browser checks done after UI changes and are the only tests that cover real dialogs, CSS and the real API. Costs: the API and MongoDB (with test data and a test account) must run during the tests, the tests are slower and flakier than unit and component tests, and CI would need the same setup. Component tests (Vitest, happy-dom) already cover component logic.
