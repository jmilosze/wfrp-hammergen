# Hammergen

## Overview

Hammergen is a tool for the Warhammer Fantasy Roleplay community. It is a tool for creating and managing campaigns, characters, and other resources.

Deployed version is available at https://hammergen.net

The projects consists of two parts:

- [Frontend](./src/frontend) - Static Vue.js application served from CDN that makes API requests to the backend
- [Backend](./src/api-go) - Go application that serves the frontend and makes database requests

To run the project locally, you need to serve the frontend and backend independently.

### Frontend

```
npm run dev --prefix ./src/frontend
```

This will serve the frontend on http://localhost:5173/ and make API requests to the backend on http://localhost:8080. The backend address can be changed using the `VITE_ROOT_API` environment variable in [.env.development](src/frontend/.env.development).

### Backend

The backend connects to MongoDB. You have a few options to run it:

- Directly compile from source. If you are using this option, you have to manually configure the environment variables. The variables are described in [config.go](src/api-go/internal/config/config.go).

  ```
  cd ./src/api-go
  go run ./cmd/wfrp/main.go
  ```

- Use docker compose. This will deploy MongoDB and the Go backend container served on port 8081. It comes with sample data defined in the [mock_data](src/api-go/test/mock_data) directory.

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

Before running tests, you have to start the backend. You can do this by going to `./src` and running `make dev-up` or `make dev-restart`.

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
