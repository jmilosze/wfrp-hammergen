# Plan P1 — Migrate content documents to the edition-variant format

Status: **in progress** (2026-09-30) — maintenance mode deployed (step 5); migration and DB scripts written and tested on a copy of the 29-09-2026 dump (steps 2–3); MongoDB layer (step 1) next. Tracker item: C1a.

## Goal

Change how content is stored in MongoDB to the option B format (design §4.1a) so that 5e can be added later, **without implementing anything about 5e now**. After P1 ships, users see no difference: no UI changes, no API changes, no 5e content or rules.

## Scope

In scope:
- Migrate content documents from `object` to `editions.4e`.
- Make the backend's MongoDB layer read and write the new format.

Not in scope (moved to the start of the 5e work, see "Later" below):
- `edition` in the API, the `edition` field on characters, frontend changes, UI toggles, 5e validation or content.

## Target format

Content collections (mutation, spell, prayer, property, item, talent, skill, career, trait, rune):

```
// before
{ _id, ownerid, visibility, object: { ... } }

// after
{ _id, ownerid, visibility, editions: { "4e": { ... same as today's object ... } } }
```

- Variant key `"4e"` (later `"5e"`): string keys avoid `editions.5.name` looking like an array index.
- `ownerid` and `visibility` stay on the document.
- **Characters are not migrated** (they will get a top-level `edition` field later, not variants).
- `other` collection (generationProps) is not migrated.

## Steps

### 1. Backend — MongoDB layer only (`internal/dependencies/mongodb/wh.go`)
- One constant for the edition used internally (`"4e"`), in the MongoDB layer only.
- Separate read/write document structs for content (`editions.4e`) and characters (`object`, unchanged).
- **Retrieve**: filter adds `editions.4e: {$exists: true}`; decode `editions.4e` into the domain object, e.g. via projection or an aggregation `$project: {object: "$editions.4e"}` so the decode path stays the same.
- **Create**: insert `{_id, ownerid, visibility, editions: {"4e": object}}`.
- **Update**: `UpdateOne({_id, ownerid}, {$set: {"editions.4e": object, "visibility": visibility}})` instead of `ReplaceOne` (so a future 5e variant is never overwritten).
- **Delete**: unchanged (deletes the whole document; there is only one variant).
- `careerLevelContainsQuery`: paths `object.levelN.*` → `editions.4e.levelN.*`.
- Domain, services, validation, HTTP handlers and JSON responses: **no changes**.

### 2. Migration script (`db/scripts/migrate_editions.py`, pymongo like the other scripts)
- For each content collection: `update_many({"object": {"$exists": True}}, {"$rename": {"object": "editions.4e"}})`.
- Idempotent (already-migrated documents don't match).
- `--dry-run`: print per-collection counts of documents to migrate.
- Verify afterwards: no content document has `object`; every content document has `editions.4e`; per-collection totals unchanged.

### 3. Other DB scripts
- `find_duplicates.py` and `replace_duplicate.py` read `object.*` for content: switch to `editions.4e.*` (characters keep `object`).

### 4. Tests
- Update `internal/dependencies/mongodb/wh_test.go` for the new document shape.
- Mock data seeds go through the DB layer, so they need no changes.
- `internal/services/wh_test.go`, integration tests (`test/integration/*`) and frontend tests should pass **unchanged** — that is the check that nothing user-visible changed.
- Add a DB-layer test that `Update` keeps other keys under `editions` intact (simulate a `"5e"` key inserted directly).

### 5. Maintenance mode (separate PR, ships first)
- Backend: env `HAMMERGEN_MAINTENANCE_ENABLED` (default `false`). When `true`, every route except `GET /api/status` returns 503 `{"message":"maintenance"}` (after CORS, so browsers can read it). `GET /api/status` returns `{"data":{"maintenance":bool}}`.
- Frontend: checks `/api/status` on load and watches every API response; a maintenance 503 shows a full-screen "Maintenance in progress" page over all routes. No frontend deploy is needed to toggle.
- Toggle (deploys keep existing env vars, so the flag survives a backend deploy):
  `gcloud run services update hammergen-production --region=<REGION> --project=<PROJECT_ID> --update-env-vars=HAMMERGEN_MAINTENANCE_ENABLED=true` (or `=false`).

### 6. Rollout
Rehearsal:
1. Backup production (`db/backup.sh`), restore to local (`db/restore_to_local.sh`).
2. Run the migration with `--dry-run`, then for real; run the new backend and current frontend against it; click through lists, edit/save, copy, delete, character view/print/CSV and the generator.

Production:
1. Maintenance on (open tabs switch to the maintenance page on their next request).
2. Backup production.
3. Run the migration and its verification.
4. Deploy the new backend (maintenance stays on).
5. Maintenance off; smoke test as in the rehearsal.
6. Rollback if needed: maintenance on, restore the backup, redeploy the previous backend, maintenance off.

## Done when
- Every content document is in `editions.4e` format; characters and `other` unchanged.
- All existing Go and frontend tests pass without changes (except the DB-layer tests).
- Users see no difference.

## Later (start of the 5e work, not P1)
- `edition` query parameter on content routes; per-variant create/update/delete; list/get return the requested variant; `full=true` resolves references in the same edition.
- `edition` field on characters (existing ones set to `4e`), immutable after creation.
- Frontend: pass the edition through the API layer (`crudGenerator.ts`, direct calls in `career.ts` and `character.ts`).
- Editor 4e/5e toggle (C5).
