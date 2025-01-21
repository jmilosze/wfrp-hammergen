# Hammergen

## Overview

Hammergen is a tool for the Warhammer Fantasy Roleplay community. It is a tool for creating and managing campaigns, characters, and other resources.

Deployed version is available at https://hammergen.net

The projects consists of two parts:

- [Frontend](./src/frontend) - Static Vue.js application served from CDN that makes API requests to the backend
- [Backend](./src/api-go) - Go application that serves the frontend and makes database requests

c

To run the project locally, you need to serve the frontend and backend independently.

### Frontend

```
npm run dev --prefix ./src/frontend
```

This will serve the frontend on http://localhost:5173/ and make API requests to the backend on http://localhost:8080. The backend address can be changed using the `VITE_ROOT_API` environment variable in [.env.development](src/frontend/.env.development).

### Backend

The backend can be configured to run either with in-memory database or with MongoDB. You have a few options to run it:

- Directly compile from source. If you are using this option, you have to manually configure the environment variables. The variables are described in [config.go](src/api-go/internal/config/config.go).

  ```
  cd ./src/api-go
  go run ./cmd/wfrp/main.go
  ```

- Use docker compose. This will deploy 2 containers: one with in-memory database and one with MongoDB. The in-memory database is served on port 8082, while the MongoDB is served on port 8081. They both come with sample data defined in [mock_data](src/api-go/test/mock_data) directory.

  To use any of them by the frontend, you have to change the `VITE_ROOT_API` environment variable in [.env.development](src/frontend/.env.development).

  ```
  cd ./src
  make dev-up
  ```

  To stop the containers, run `make dev-down`.

## Running tests

Go to the source directory:

```
cd ./src
```

### Frontend

```
npm run test --prefix ./frontend
```

### Backend

Before running tests, you have to start the backend. You can do this by running `make dev-up` command or `make dev-restart` command.

To run tests with in-memory database, you can use `make test-memdb` command.

```
make test-memdb
```

To run tests with MongoDB, you can use `make test` command.

```
make test
```

## Linting

Go to the source directory:

```
cd ./src
```

To run linting, you can use `make lint` command.

```
npm run lint --prefix ./frontend
```
