## Architecture

The Go backend uses a simplified two-layer architecture:
- [ ] **Web Layer:** HTTP routing via Chi, OpenAPI request validation via `kin-openapi`, contract enforcement via `oapi-codegen`, authentication (JWT/OAuth2), reCAPTCHA verification, and response serialization.
- [ ] **Service Layer:** Business domain logic with embedded MongoDB data access, eliminating unnecessary database abstraction interfaces.

## Tech Stack

- [ ] **API Contract:** OpenAPI 3.0+ YAML specification (single source of truth)
- [x] **Backend:** Go (Golang)
  - [ ] Code Generator: [`oapi-codegen`](https://github.com/oapi-codegen/oapi-codegen) (generates Go types and Chi server routing)
  - [ ] Request Validation: [`kin-openapi` Chi middleware](https://github.com/oapi-codegen/oapi-codegen/tree/main/pkg/middleware)
  - [ ] Router: [`go-chi/chi/v5`](https://github.com/go-chi/chi)
  - [x] CORS: [`rs/cors`](https://github.com/rs/cors)
  - [x] JWT Auth: [`golang-jwt/jwt/v5`](https://github.com/golang-jwt/jwt)
  - [ ] OAuth2 (Google & GitHub): [`golang.org/x/oauth2`](https://pkg.go.dev/golang.org/x/oauth2)
  - [ ] Transactional Email: [`resend-go/v2`](https://github.com/resend/resend-go)
  - [x] Anti-Abuse: Google reCAPTCHA v3
  - [x] Database Driver: [`go.mongodb.org/mongo-driver/v2`](https://go.mongodb.org/mongo-driver/v2)
- [x] **Frontend:** Vue 3 + TypeScript
  - [x] Bundler: [Vite](https://vitejs.dev/)
  - [x] Styling: [Tailwind CSS v4](https://tailwindcss.com/)
  - [ ] UI Components (Optional): [`shadcn-vue`](https://www.shadcn-vue.com/)
  - [x] Routing: [`vue-router`](https://router.vuejs.org/)
  - [x] Icons: [`@iconify/vue`](https://iconify.design/)
  - [ ] Code Generator: [`openapi-typescript`](https://openapi-ts.dev/)
  - [x] Captcha: [`vue-recaptcha-v3`](https://github.com/AStarStartup/vue-recaptcha-v3)
  - [x] Testing: [Vitest](https://vitest.dev/)

## Infrastructure & Deployment

- [x] **Database:** MongoDB (hosted in a GCP cluster for low-latency access)
- [x] **Backend Hosting:** GCP Cloud Run
- [x] **Frontend Hosting:** Cloudflare Pages
- [x] **CI/CD:** GitHub Actions (automated linting, tests, and deployments)

## UI & UX

- [ ] Redesign UI

## Cleanup & Refactoring

- [x] Remove production data older than 4 years
- [x] Remove memdb support
- [ ] Investigate merging service and database layers
