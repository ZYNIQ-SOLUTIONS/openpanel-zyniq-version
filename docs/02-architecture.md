# 🏗️ Architecture – OpenPanel Zyniq

## Monorepo Structure

This is a **pnpm workspace monorepo** managed with `pnpm@10.6.2`.

```
/
├── apps/
│   ├── api/           → Fastify REST/tRPC backend (Node.js server)
│   ├── start/         → TanStack Start dashboard (React 19, SSR-capable)
│   ├── worker/        → BullMQ background job processor
│   ├── public/        → Marketing/docs website (Next.js)
│   └── justfuckinguseopenpanel/  → Lightweight standalone demo app
├── packages/
│   ├── auth/          → Session management (Oslo + Arctic)
│   ├── common/        → Shared utilities (ID gen, referrers, etc.)
│   ├── constants/     → Shared enums + constants
│   ├── db/            → Database layer (Prisma + ClickHouse client)
│   ├── email/         → Email templates + Resend integration
│   ├── geo/           → GeoIP lookup (code-generated data)
│   ├── importer/      → Data importer from other analytics platforms
│   ├── integrations/  → Third-party integration adapters
│   ├── js-runtime/    → Safe JavaScript sandbox (AST-based validator + executor)
│   ├── json/          → JSON helpers
│   ├── logger/        → Winston-based structured logger
│   ├── payments/      → Billing / payments abstraction
│   ├── queue/         → BullMQ queue definitions
│   ├── redis/         → Redis client wrapper
│   ├── sdks/          → Published client SDKs
│   │   ├── web/       → Browser JS SDK
│   │   ├── nextjs/    → Next.js SDK
│   │   ├── react-native/ → React Native SDK
│   │   ├── sdk/       → Core SDK
│   │   ├── astro/     → Astro SDK
│   │   ├── nuxt/      → Nuxt SDK
│   │   ├── express/   → Express SDK
│   │   └── _info/     → SDK metadata
│   ├── trpc/          → tRPC router definitions
│   └── validation/    → Zod schemas (shared)
├── tooling/
│   ├── typescript/    → Shared tsconfig bases
│   └── publish/       → Package publishing scripts
├── docker/            → Docker infrastructure configs (ClickHouse init)
├── scripts/           → Utility scripts
└── sh/                → Shell deployment scripts
```

---

## System Data Flow

```
Browser/Mobile Client
        │
        ▼
   [SDK (web/rn/etc)]
        │  POST /event
        ▼
   ┌─────────────────────────────────────────┐
   │          API (Fastify 5 on :3333)        │
   │  ┌─────────────────────────────────────┐│
   │  │ Hooks: IP resolve, timestamp, auth  ││
   │  └─────────────────────────────────────┘│
   │  Routes:                                │
   │   /event      → Event ingestion         │
   │   /track      → Tracking endpoint       │
   │   /profile    → Profile updates         │
   │   /trpc/*     → Dashboard API (tRPC)    │
   │   /ai/*       → AI insights             │
   │   /live/*     → Real-time WebSocket     │
   │   /import     → Data via CSV/etc        │
   │   /export     → Data out               │
   │   /manage     → Client management       │
   │   /webhook    → Third-party webhooks    │
   │   /oauth      → OAuth callbacks         │
   │   /metrics    → Prometheus metrics      │
   └─────────────────────────────────────────┘
        │              │              │
        ▼              ▼              ▼
   [PostgreSQL]    [ClickHouse]    [Redis]
   (Prisma ORM)   (Events/Analytics) (Cache+PubSub+Queue)
                                       │
                                       ▼
                               ┌───────────────┐
                               │   Worker      │
                               │  (BullMQ)     │
                               │  Background   │
                               │  Jobs:        │
                               │  - Email send │
                               │  - Data proc  │
                               │  - Alerts     │
                               │  - Integrat.  │
                               └───────────────┘
                                       │
                                       ▼
                         [Dashboard: TanStack Start :3000]
                          React 19 / SSR / TailwindCSS v4
                          TanStack Router + TanStack Query
                          tRPC client
```

---

## Authentication Architecture

- **Session-based auth** using [Oslo](https://oslojs.dev) for session tokens
- Cookie-based session storage (`session` cookie, signed)
- **OAuth** via [Arctic](https://arcticjs.dev) for third-party logins
- Session stored in PostgreSQL, validated per-request in API hook

---

## Database Dual-Write Pattern

- **PostgreSQL** (via Prisma): Stores organizational data — users, organizations, projects, clients, dashboards, settings, sessions
- **ClickHouse**: Stores all analytics events — time-series events optimized for analytical queries
- Both databases are written to during event ingestion — events are first queued to Redis/BullMQ, then flushed to ClickHouse in batches

---

## Real-time Architecture

- Redis **pub/sub** is used for live event broadcasting
- Dashboard subscribes via **WebSocket** (`/live` route using `@fastify/websocket`)
- Redis keyspace notifications (`notify-keyspace-events=Ex`) power some real-time features

---

## AI Architecture

- Uses Vercel AI SDK supporting **Anthropic Claude** and **OpenAI**
- Exposes an `/ai` route on the API
- Dashboard has AI chat / insight components (`@ai-sdk/react`)
- `@openpanel/js-runtime` provides a **sandboxed JS executor** for user-defined transformations — validates JavaScript AST before execution using `@babel/parser`

---

## Build & Tooling

| Tool | Purpose |
|------|---------|
| `pnpm` | Package manager (workspace) |
| `tsdown` | TypeScript bundler for API + Worker (fast, esbuild-based) |
| `Vite 6` | Frontend bundler for Dashboard |
| `Biome` | Linter + formatter |
| `Vitest` | Unit testing |
| `Prisma` | ORM + migrations |
| `simple-git-hooks` | Pre-push: typecheck + test |
| `Wrangler` | Cloudflare Workers deployment option |
| `jiti` | Script runner for TypeScript scripts |
