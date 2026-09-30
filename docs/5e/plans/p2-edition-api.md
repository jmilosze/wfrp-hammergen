# Plan P2 — Edition in the API

Status: **in progress** (2026-09-30) — first version (top-level character `edition`) deployed to production; follow-up moving the character edition into the character object implemented and tested, rollout of the follow-up next. Tracker item: C1b.

## Goal

Make the API and the frontend's API layer edition-aware, so that 5e content and 5e characters can be added in later steps. After P2 ships, users still see no difference: the UI stays 4e-only.

## Decisions (2026-09-30)

- **Content uses the document shape in the API:** requests and responses carry `editions: {"4e": {...}, "5e": {...}}`, mirroring the DB. `?edition=4e|5e` on reads narrows the response to one variant; without it, all variants are returned. Writes take the edition(s) from the payload, not from the URL.
- **PUT merges variants:** it writes the variants in the payload and leaves others untouched. (The frontend always sends every variant it has, so this is a safety net, not a feature.) Removing a variant is an explicit `DELETE ?edition=E`.
- **`full=true` requires `edition`**, and references are resolved in that edition.
- **Career search (`skillId`, `talentId`) requires `edition`**.
- **Characters keep a single-variant shape** `{id, ownerId, visibility, object}` (option b), with the edition as a field of the character object (`object.edition`, 2026-09-30 follow-up; first deployed as a top-level field): a character has exactly one edition, fixed at creation.
- **No 5e write guard:** 5e variants can be written. We control the frontend and it will not write 5e until C2/H1; until then a 5e variant is validated with the same rules as 4e (the domain types are shared).
- Replaces the earlier per-edition decision (option A, `?edition` required on every route and 5e writes rejected).

## Scope

In scope:
- `editions` map in content requests/responses; optional `edition` filter on reads.
- `edition` field on characters (existing ones migrated to `4e`), immutable after creation.
- Frontend API layer reads/writes the `editions` map; the UI keeps working with `4e` only.

Not in scope:
- 5e validation, 5e content, 5e characters (C2, H1).
- Browsing/filtering by edition in the UI (C4), editor toggle (C5).
- Generation props (`/api/wh/generation`): unchanged, 4e only until the 5e generator (phase 4).

## API

`edition`, where accepted, must be `4e` or `5e`; any other value → 400.

### Content (`/api/wh/<type>` for all content types)

Response shape: `{id, ownerId, visibility, editions: {"4e": {...}, "5e": {...}}}` — only the variants that exist (and, with `?edition=E`, only `E`).

| Route | Behaviour |
|---|---|
| `GET /api/wh/<type>` | All documents, all variants. |
| `GET /api/wh/<type>?edition=E` | Documents that have variant `E`; `editions` contains only `E`. |
| `GET /api/wh/<type>/:id[?edition=E]` | Same, for one document; 404 if it has no variant `E`. |
| `?full=true` | Requires `edition` (400 without). References (item properties, runes, grimoire spells) resolved in `E`. |
| `?skillId=…` / `?talentId=…` (careers) | Require `edition` (400 without); match within `E`. |
| `POST /api/wh/<type>` | Body `{visibility, editions: {...}}` with at least one variant; each variant validated. |
| `PUT /api/wh/<type>/:id` | Body as for POST. Writes `visibility` and every variant in the payload; other variants untouched. |
| `DELETE /api/wh/<type>/:id?edition=E` | Removes variant `E`; when it was the last one, the document is deleted. |
| `DELETE /api/wh/<type>/:id` | Deletes the whole document. |

### Characters (`/api/wh/character`)

Response shape: `{id, ownerId, visibility, object: {edition, ...}}`.

| Route | Behaviour |
|---|---|
| `GET /api/wh/character[?edition=E]` | All characters, or only characters of edition `E`. |
| `GET /api/wh/character/:id[?edition=E]` | 404 if the character is not of edition `E`. |
| `?full=true` | Requires `edition` (same rule as content); references resolved in `E`, which is the character's own edition. |
| `POST /api/wh/character` | Body as today (character fields plus `visibility`), with the `edition` character field (required, `4e`/`5e`). |
| `PUT /api/wh/character/:id` | As POST; 400 if `edition` differs from the stored edition (edition is immutable). |
| `DELETE /api/wh/character/:id` | Deletes the character. |

## Steps

### 1. Backend — domain
- `Edition` type and values (`4e`, `5e`) — already in place.
- `Wh` carries content variants as `Editions map[Edition]WhObject` and characters as `Object`; `Character` (and `CharacterFull`) has an `Edition` field validated as `edition_valid`. JSON uses `omitempty` so each type only returns its own fields.
- Validation runs per variant for content, on `Object` for characters.

### 2. Backend — HTTP handlers (`internal/dependencies/gin/wh.go`)
- Optional `edition` on GET/DELETE; required with `full=true` and career `skillId`/`talentId`.
- Content POST/PUT: parse `{visibility, editions}`, decode each variant into the type's domain object; 400 on no variants or unknown edition key.
- Character POST/PUT: the edition is a character field, validated with the rest of the character.

### 3. Backend — service (`internal/services/wh.go`)
- `Get` with optional edition; `full=true` passes the edition to nested `Get` calls.
- Character `Update`: 400 when the payload edition differs from the stored one.

### 4. Backend — MongoDB layer (`internal/dependencies/mongodb/wh.go`)
- Retrieve with optional edition: filter `editions.E exists` (content) or `object.edition: E` (characters) only when given; decode all variants, or just `E`.
- Create: insert the `editions` map (content) or `object` (characters).
- Update: `$set` `visibility` and `editions.<E>` for each variant in the payload (content); `$set` `object` and `visibility` (characters).
- Delete: with edition, `$unset` the variant then delete the document if `editions` is empty; without, delete the document.
- Career skill/talent query on `editions.<E>.levelN.*`.

### 5. Character migration (`db/scripts/migrate_character_editions.py`)
- First version (run on all environments): set a top-level `edition: "4e"` on characters.
- Follow-up (replaces it): `$rename` `edition` → `object.edition`; idempotent, `--dry-run`, confirmation, verification (no top-level `edition`; every character has `object.edition` of `4e`/`5e`).

### 6. Frontend — API layer
- Content `ApiResponse` becomes `{id, ownerId, visibility, editions: Partial<Record<Edition, T>>}`; characters get their own response type with `object`, and `edition` is a field of the character data.
- Each entity's `apiResponseToModel` reads `editions[UI_EDITION]`; `modelToApi` builds `{visibility, editions: {[UI_EDITION]: …}}`.
- `createWhApi`: `listElements` / `getElement` take an optional edition; `deleteElement` takes an optional edition; create/update send the payload as built.
- The UI asks for `UI_EDITION` (`4e`) everywhere it reads content, so it only ever receives the 4e variant; `full=true` and career lookups pass it as required.
- Character create/update send `edition: UI_EDITION` as a character field.
- Deleting from the UI sends `?edition=4e`, so it removes only the 4e variant; a 5e variant (none exist yet) would stay.

### 7. Tests
- Go unit tests: handler parsing (optional/required `edition`, `editions` payload), character edition immutability in the service.
- DB-layer tests (real MongoDB): retrieve with and without edition; multi-variant create; update merges variants; variant and whole-document delete; characters by edition; career search per edition.
- Integration tests: new request/response shapes; cases for `full=true` / career search without edition (400), invalid edition (400), missing variant (404), PUT merge, variant delete, character edition change (400).
- Frontend tests: converters and API calls for the new shapes.
- Regression check as in P1: current API on the production backup vs new API on the same backup after the character migration; content responses compared as `object` (old) vs `editions["4e"]` (new), everything else identical.

### 8. Rollout
The response shape changes, so the old frontend cannot read the new API and vice versa: **frontend and backend ship together** in a maintenance window.

Per environment (local → staging → production):
1. Maintenance on.
2. Backup.
3. Run the character migration and its verification.
4. Deploy the new backend (via the GitHub Action, so the maintenance flag is kept) and the new frontend.
5. Maintenance off; smoke test (lists, edit/save, copy, delete, character view/print/CSV, generator).

Browser tabs still running the old frontend break until reloaded — check whether the maintenance page reloads the app when maintenance ends.

Rollback: maintenance on, redeploy the previous backend and frontend, maintenance off. For the follow-up, also move `object.edition` back to a top-level `edition` (or restore the backup).

## Done when
- Content requests/responses use the `editions` map; characters carry `edition` in the character object.
- Every character has `object.edition: "4e"`.
- The UI works exactly as before, reading and writing `4e` only.
- Users see no difference.

## Later
- 5e validation once C2 (content) and H1 (characters) define it.
- Editor toggle (C5) editing both variants of a document.
- Edition-aware generation props (phase 4).
