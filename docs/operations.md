# Operations

How to run, test, change data and deploy. See `README.md` for the basic setup.

## Local environment

- **MongoDB:** the `src-mongodb-1` container on `localhost:27017` (user `admin`, password `admin`). The dev database is `hammergenGo`; it usually holds a production snapshot (see "Backups and restore").
- **The owner's own servers:** the API runs from GoLand on `:8080` and Vite on `:5173`. Don't stop or restart them.
- **Separate servers for checks** (leave 8080/5173 alone):
  - API on `:8082`: from `src/api-go`, run `HAMMERGEN_SERVER_PORT=8082 HAMMERGEN_SERVICES_EMAIL=mockemail HAMMERGEN_SERVICES_CAPTCHA=mockcaptcha go run ./cmd/wfrp`. `go run` leaves a child process: stop it by the port's pid.
  - Frontend on `:5174` against that API: the `frontend-walkthrough` configuration in `.claude/launch.json` (`VITE_ROOT_API=http://127.0.0.1:8082`).
  - With mock captcha, registration accepts the captcha value `success`; test accounts can be created on the local API. Use `@example.test` addresses and keep passwords out of chat.
- **Dev API container:** `wfrp-mongodb` on `:8081` (from `src/docker-compose.yaml`, `make dev-up`); it uses the local MongoDB above. `make dev-down`/`dev-restart` keep the data.
- **Integration-test stack:** `make test` runs its own throwaway project (`src/docker-compose.test.yaml`: own MongoDB, API on `:8083`) and deletes it first, so the dev data is untouched.

## Tests and checks

Frontend (`src/frontend`):
- `npx vue-tsc --noEmit`: type-check
- `npx eslint src`: lint (`npm run lint` runs both)
- `npx vitest run`: unit tests (`*.spec.ts` next to the code)
- `npx prettier --write <files>`: format only the files you changed (many older files are not formatted yet, HG-18)

Backend (`src/api-go`):
- `go test ./internal/...`: unit tests. Don't run `go test ./...`: it also runs `test/integration` against `:8081` by default (it writes junk users into local `hammergenGo`). Use `make test` (own stack on `:8083`) and run integration tests only when asked.
- `gofmt -l internal test`, `go vet ./internal/...`
- The MongoDB tests in `internal/dependencies/mongodb/*_mongo_test.go` are skipped unless `HAMMERGEN_TEST_MONGODB_URI` is set (e.g. `mongodb://admin:admin@localhost:27017`); each creates and drops its own database.

CI (`.github/workflows/lint.yml`) runs the frontend lint and tests on pull requests.

## Data scripts (`db/scripts`)

Python scripts with pymongo, run with the repo virtualenv: `.venv/bin/python db/scripts/<script>.py`.

Every script that writes follows the same pattern:
- `--uri` and `--db` (default: local `mongodb://admin:admin@localhost:27017`, `hammergenGo`), `--dry-run` to print what would change;
- before writing, the user must type `yes`;
- it checks the result after writing ("Verification passed");
- it is idempotent: a second run reports nothing to do;
- it aborts without writing when something is unexpected (missing id, wrong name).

Main scripts:
- `import_5e.py --type <trait|mutation|property|prayer|spell|talent|skill|item|career> [--update]`: imports 5e content from `db/data/5e/<type>s-5e.json`. Entries with `id4e` add a 5e variant to that public 4e document; entries without it create 5e-only documents. `--update` replaces variants that differ from the data file. A 5e-only entry with a fixed `id` may carry `variant4e`, the same fields for a 4e variant: the document is then created, compared and updated with both editions (used for trappings made for 5e careers). An entry found by its 5e name may carry `variant4e` too, which adds or updates that document's 4e variant (5e-only trappings that 4e careers have). To import only some entries, pass a smaller data file with `--data`; it needs at least one entry with `id4e`, which gives the owner of new documents.

The data files in `db/data/` are gitignored and exist only locally; keep them, they are the source for re-imports.

Field types must be the ones the API reads (the Go types in `src/api-go/internal/domain/warhammer/` and `internal/dependencies/mongodb/`): a single document of the wrong type makes every list request that includes it fail. Scripts that create documents copy each field's type from an existing document of the same kind, checked with Python's `type()` or MongoDB's `$type`, never from a printed JSON (`json.dumps(default=str)` shows dates as strings). Dates such as `modifiedon` are `datetime`.

Content text: descriptions must not be copied from the books. Rephrase; an occasional copied sentence is fine. Check rephrased text by making sure no run of 12 or more words matches the book.

## Environments and databases

| Environment | Database | Config |
|---|---|---|
| local | `hammergenGo` | defaults above |
| staging | `test-go` | `deployment/gcp/staging/config.json` |
| production | `hammergen-go` | `deployment/gcp/production/config.json` |

The config files are gitignored and contain secrets. Read the connection string without printing it, e.g.:

```bash
export MONGO_URI="$(.venv/bin/python -c "import json;print(json.load(open('deployment/gcp/staging/config.json'))['env_variables']['HAMMERGEN_MONGODB_URI'])")"
export DB_NAME="$(.venv/bin/python -c "import json;print(json.load(open('deployment/gcp/staging/config.json'))['env_variables']['HAMMERGEN_MONGODB_NAME'])")"
```

Ask before using `gcloud`.

## Changing data: required procedure

Every write to a database (fix scripts, imports, manual updates, data a deploy needs) goes local → staging → production, and each environment must pass its checks before the next one is touched. **Staging and production are not written until the local checks pass.** If a check fails anywhere, stop, fix the cause and start again from local.

1. **Local**
   - MongoDB must be running: `docker ps --filter name=src-mongodb-1`. If it isn't, start it (`docker start src-mongodb-1`, or `docker compose -f src/docker-compose.yaml up -d mongodb` if the container doesn't exist). Local data should be a recent production snapshot (`db/restore_to_local.sh`); a script that finds unexpected values locally usually means the snapshot is old.
   - Run the script with `--dry-run`, then for real.
   - Type check: from `src/api-go`, `go run ./cmd/checkdata` must end with "0 the API cannot read". It decodes every document with the API's own types (read only).
   - API check: start the API on `:8082` (see "Local environment"; the owner's API on `:8080` may not be running), then for every type the change touched and each edition it has, `curl -s "http://localhost:8082/api/wh/<type>?edition=<4e|5e>"` must return 200 and show the changed documents with their new values. Stop the `:8082` API afterwards.
2. **Staging** (`MONGO_URI`/`DB_NAME` from the staging config): `--dry-run`, write, `go run ./cmd/checkdata` (it reads `MONGO_URI` and `DB_NAME`), then the same `curl` checks against the staging API (`VITE_ROOT_API` in `src/frontend/.env.gcp_staging`).
3. **Production**: take the backup ("Backups and restore"), `--dry-run`, write, `go run ./cmd/checkdata`, then the `curl` checks against the production API (`src/frontend/.env.gcp_production`). If a check fails, fix it at once or restore the backup.

A script's own "Verification passed" only re-reads the values the script wrote; it does not replace the type and API checks.

## Backups and restore

- **Before every production write**, take a backup from the repo root:

  ```bash
  mongodump --archive=db/hammergen_DD_MM_YYYY_before_<what> --gzip --uri="$MONGO_URI" --db="$DB_NAME"
  ```

  Backups (`db/hammergen_*`) are gitignored.
- `db/restore_to_local.sh <archive>`: restores a production archive into local `hammergenGo` (drops existing data).
- `db/restore.sh <uri> <archive>`: restores a production archive into `test-go` (staging).
- `db/backup.sh <uri>`: plain dated dump.

## Deploying

- The owner deploys and commits; agents don't commit, create branches or deploy.
- GitHub Actions, started by hand (`workflow_dispatch`) with the environment (staging or production):
  - `deploy-backend`: builds `src/Dockerfile` (base images from `mirror.gcr.io` to avoid Docker Hub rate limits), pushes to Artifact Registry and deploys Cloud Run `hammergen-<env>`.
  - `deploy-frontend`: builds with `npm run build_gcp_<env>` and deploys to Firebase Hosting.
- When a change touches the API and the frontend, deploy the backend first, then the frontend. Data the new code needs (e.g. a new generation document) goes in before the deploy, following "Changing data: required procedure".
- `deployment/gcp/deploy.py` is an older local deploy script (see HG-21).
- Maintenance mode: `HAMMERGEN_MAINTENANCE_ENABLED` on Cloud Run; the frontend shows a maintenance page while it is on.
- Indexes: the API creates its MongoDB indexes at startup when `HAMMERGEN_MONGODB_CREATE_USER_INDEXES` (unique `username`) and `HAMMERGEN_MONGODB_CREATE_WH_INDEXES` (unique `name` on `other`, `ownerid` and `visibility` on the content collections) are on. It skips a field that already has an index, whatever its name (production names some after the field, e.g. `name`), and stops if that index differs in uniqueness, so they can stay on. Cloud Run deploys keep the service's environment variables, so a flag set once stays set.
- After an Atlas tier change, restart the Cloud Run instances (deploy a new revision): instances started before the change can keep failing to connect.
