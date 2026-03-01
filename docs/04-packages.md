# 📦 Packages Reference – OpenPanel Zyniq

All shared packages live under `packages/` and are referenced as `@openpanel/<name>` workspace dependencies.

---

## `@openpanel/auth`

**Path**: `packages/auth`

Session management using [Oslo](https://oslojs.dev) for token generation/validation.

- `src/` — Session validation, cookie domain parsing, Argon2 password hashing
- `server/` — Server-only auth utilities
- Uses `@node-rs/argon2` for password hashing (native addon)
- Arctic OAuth support (`arctic`) for third-party providers (Google, GitHub, etc.)

**Key exports**: `validateSessionToken`, `decodeSessionToken`, `EMPTY_SESSION`, session types

---

## `@openpanel/common`

**Path**: `packages/common`

Shared utility functions used by all apps.

- ID generation (`generateId`)
- Referrer detection / normalization
- Device/browser parsing utilities
- Shared type definitions

---

## `@openpanel/constants`

**Path**: `packages/constants`

Shared constants and enums throughout the monorepo.

---

## `@openpanel/db`

**Path**: `packages/db`

The entire database abstraction layer.

### PostgreSQL (Prisma)
- `prisma/schema.prisma` → Main schema (users, orgs, projects, clients, dashboards, sessions, etc.)
- `prisma/migrations/` → SQL migration history
- `src/` → Service layer (68 files) — organized by domain: events, projects, users, orgs, clients, dashboards, etc.
- Prisma v6 with read-replica extension (`@prisma/extension-read-replicas`)
- Prisma JSON types generator for typed JSON columns

### ClickHouse (@clickhouse/client)
- Analytics event storage and querying
- Time-series data, funnel computations, cohort analysis

### Code Migrations
- `code-migrations/` — Custom programmatic migrations beyond SQL

**Key commands**:
```bash
pnpm codegen          # Generate Prisma client
pnpm migrate          # Create new migration (dev)
pnpm migrate:deploy   # Deploy all pending migrations (production)
```

---

## `@openpanel/email`

**Path**: `packages/email`

Email sending using [Resend](https://resend.com).

- React Email templates for all transactional emails (sign-up, alerts, reports, invitations)
- Template rendering and delivery

---

## `@openpanel/geo`

**Path**: `packages/geo`

GeoIP lookup — converts IP addresses to country/city/region data.

- Code-generated lookup data (run `pnpm codegen`)
- Used by the API to enrich events with geo information

---

## `@openpanel/importer`

**Path**: `packages/importer`

Data import adapters for migrating from other analytics platforms.

- Supports importing events from CSV and other analytics platforms
- Used by both the API (`/import` route) and the Worker (processing import jobs)

---

## `@openpanel/integrations`

**Path**: `packages/integrations`

Third-party integration adapters.

- Webhook dispatchers for external services
- Integration-specific data transformers

---

## `@openpanel/js-runtime`

**Path**: `packages/js-runtime`

> ⚠️ **Security-critical package** — implements a sandboxed JavaScript code executor for user-defined transformations (used in notification rules, event processing, etc.)

### How It Works
1. User writes an arrow function (e.g. `(payload) => { return payload.amount > 100; }`)
2. `validate(code)` parses the code using `@babel/parser` and walks the AST
3. Only a **strict allowlist** of operations is permitted:
   - Arrow functions (no named functions, no classes)
   - Safe globals: `Math`, `JSON`, `Date`, `String`, `Number`, `Boolean`, `Array`, `Object`, `parseInt`, `parseFloat`, `isNaN`, `isFinite`, `encodeURIComponent`, etc.
   - Safe instance methods: `.map()`, `.filter()`, `.reduce()`, `.slice()`, `.includes()`, `.toLowerCase()`, etc.
4. Blocked: `import`, `export`, loops, `try/catch`, `throw`, `with`, `this`, `arguments`, `async/await`, generators, classes, `new X()` (only `new Date()` is allowed)
5. Only valid, safe code is `execute()`d

**Key exports**: `validate(code)`, `execute(code, payload)`

---

## `@openpanel/json`

**Path**: `packages/json`

JSON serialization helpers (e.g., BigInt-safe JSON).

---

## `@openpanel/logger`

**Path**: `packages/logger`

Winston-based structured logger with consistent formatting across all services.

---

## `@openpanel/payments`

**Path**: `packages/payments`

Billing and payments abstraction layer.

- Payment provider integrations
- Subscription management
- Used by both `api` and `worker`

---

## `@openpanel/queue`

**Path**: `packages/queue`

BullMQ queue definitions shared across apps.

- Queue name constants
- Job type definitions
- Used by `api` (enqueue jobs) and `worker` (process jobs)

---

## `@openpanel/redis`

**Path**: `packages/redis`

Redis client wrapper.

- Connection setup and exports
- `getRedisPub()` — Pub/Sub publisher
- `getRedisSub()` — Pub/Sub subscriber
- Helper utilities

---

## `@openpanel/sdks`

**Path**: `packages/sdks`

Published client SDKs. All sdks are independently publishable npm packages.

| SDK | Package Name | Target |
|-----|-------------|--------|
| `web` | `@openpanel/web` | Browser JavaScript |
| `sdk` | `@openpanel/sdk` | Universal (core) |
| `nextjs` | `@openpanel/nextjs` | Next.js / React SSR |
| `nuxt` | `@openpanel/nuxt` | Nuxt 3 |
| `astro` | `@openpanel/astro` | Astro |
| `react-native` | `@openpanel/react-native` | React Native (iOS + Android) |
| `express` | `@openpanel/express` | Express.js server-side |
| `_info` | `@openpanel/sdk-info` | SDK metadata registry |

---

## `@openpanel/trpc`

**Path**: `packages/trpc`

tRPC router definitions consumed by the API and dashboard.

- `appRouter` — root router combining all sub-routers
- `createContext` — context factory (session, db, etc.)
- Separate routers per domain (organizations, projects, events, users, dashboards, etc.)

---

## `@openpanel/validation`

**Path**: `packages/validation`

Zod schemas shared across the monorepo.

- Event validation schemas
- API input schemas
- Form validation schemas

---

## Package Dependency Graph (simplified)

```
apps/api  ────────────────────────────────────────────────────────────┐
apps/worker ──────────────────────────────────────────────────────────┤
apps/start ───────────────────────────────────────┐                   │
                                                   │                   │
        ┌──────────────┬──────────┬───────────┬───▼─────┬───────────▼─┤
        │  @op/trpc    │ @op/db   │ @op/redis │@op/queue│ @op/common  │
        └──────────────┴──────────┴───────────┴─────────┴─────────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
         @op/auth   @op/validation  @op/constants
              │
         @op/logger
              │
         @op/json
```
