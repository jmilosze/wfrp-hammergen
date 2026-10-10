# Operations

How to run, test, change data and deploy. See `README.md` for the basic setup.

## Local environment

- **MongoDB:** the `src-mongodb-1` container on `localhost:27017` (user `admin`, password `admin`). The dev database is `hammergenGo`; it usually holds a production snapshot (see "Backups and restore").
- **The owner's own servers:** the API runs from GoLand on `:8080` and Vite on `:5173`. Don't stop or restart them.
- **Separate servers for checks** (leave 8080/5173 alone):
  - API on `:8082`: from `src/api-go`, run `HAMMERGEN_SERVER_PORT=8082 HAMMERGEN_SERVICES_EMAIL=mockemail HAMMERGEN_SERVICES_CAPTCHA=mockcaptcha go run ./cmd/wfrp`. `go run` leaves a child process: stop it by the port's pid.
  - Frontend on `:5174` against that API: the `frontend-walkthrough` configuration in `.claude/launch.json` (`VITE_ROOT_API=http://127.0.0.1:8082`).
  - With mock captcha, registration accepts the captcha value `success`; test accounts can be created on the local API. Use `@example.test` addresses and keep passwords out of chat.
- **Integration-test container:** `wfrp-mongodb` on `:8081` (from `src/docker-compose.yaml`, `make dev-up`). It writes to the same local `hammergenGo` database.

## Tests and checks

Frontend (`src/frontend`):
- `npx vue-tsc --noEmit`: type-check
- `npx eslint src`: lint (`npm run lint` runs both)
- `npx vitest run`: unit tests (`*.spec.ts` next to the code)
- `npx prettier --write <files>`: format only the files you changed (many older files are not formatted yet, HG-18)

Backend (`src/api-go`):
- `go test ./internal/...`: unit tests. Don't run `go test ./...`: it also runs `test/integration` against the `:8081` container, which writes junk users into local `hammergenGo`. Run integration tests only when asked.
- `gofmt -l internal test`, `go vet ./internal/...` (known warnings: HG-13)

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
- `import_5e.py --type <trait|mutation|property|prayer|spell|talent|skill|item|career> [--update]`: imports 5e content from `db/data/5e/<type>s-5e.json`. Entries with `id4e` add a 5e variant to that public 4e document; entries without it create 5e-only documents. `--update` replaces variants that differ from the data file.
- `import_5e_generation.py [--update]`: builds `generationProps5e` from `db/data/5e/generation-5e.json` (names are resolved to public 5e ids).
- `fix_4e_*.py`: one-off fixes of public 4e data (each documents what it fixes). Add new fixes of the same kind to these scripts.
- `update_5e_book_0610.py`: structural changes for the 2026-10-01 5e rulebook update.

The data files in `db/data/` are gitignored and exist only locally; keep them, they are the source for re-imports.

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

Order for data changes: local first, then staging, then production. Run `--dry-run` in each environment before writing. Ask before using `gcloud`.

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
- When a change touches the API and the frontend, deploy the backend first, then the frontend. Data the new code needs (e.g. a new generation document) goes in before the deploy.
- `deployment/gcp/deploy.py` is an older local deploy script (see HG-21).
- Maintenance mode: `HAMMERGEN_MAINTENANCE_ENABLED` on Cloud Run; the frontend shows a maintenance page while it is on.
