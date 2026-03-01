# ✅ Project Status & Todo – OpenPanel Zyniq

> Last updated: 2026-02-28
> Update this file as features are completed or new work is identified.

---

## 🟢 DONE — Core Platform (Inherited from OpenPanel upstream)

### Infrastructure
- [x] PostgreSQL + Prisma ORM integration
- [x] ClickHouse analytics event storage
- [x] Redis cache + pub/sub layer
- [x] BullMQ + GroupMQ job queuing system
- [x] Docker Compose for local development
- [x] Multi-stage Dockerfiles for all apps (api, worker, start)
- [x] Prometheus metrics endpoint (`/metrics`)
- [x] BullBoard queue monitoring UI
- [x] Health check endpoints (`/healthcheck`, `/healthz/live`, `/healthz/ready`)
- [x] Graceful shutdown (SIGTERM/SIGINT handling)
- [x] Redis keyspace notifications for real-time features

### Backend (apps/api)
- [x] Fastify 5 HTTP server
- [x] tRPC v11 for dashboard API
- [x] Session-based authentication (Oslo + Argon2)
- [x] OAuth callbacks (Arctic — GitHub, Google)
- [x] CORS per-route policy (public vs dashboard)
- [x] Rate limiting
- [x] WebSocket real-time feed (`/live` route)
- [x] Event ingestion endpoint (`/event`)
- [x] Tracking endpoint (`/track`)
- [x] Profile management (`/profile`)
- [x] Data export (`/export`)
- [x] Data import (`/import`)
- [x] AI insights API (`/ai` — Claude + OpenAI)
- [x] Webhook handler (`/webhook` — Svix)
- [x] Bot detection (custom bot list)
- [x] IP resolution for geo enrichment
- [x] Request logging hook
- [x] Timestamp hook

### Background Worker (apps/worker)
- [x] BullMQ job processor
- [x] Email delivery jobs
- [x] Event enrichment jobs
- [x] Integration webhook dispatch
- [x] Import processing jobs
- [x] Billing/payment jobs
- [x] Prometheus metrics

### Dashboard (apps/start)
- [x] TanStack Start (React 19 + SSR)
- [x] TanStack Router (file-system routing)
- [x] TanStack Query (server state)
- [x] Redux Toolkit (client state)
- [x] tRPC client integration
- [x] Real-time WebSocket connection
- [x] Analytics dashboard views
- [x] Funnel analysis
- [x] Cohort analysis
- [x] User profiles & session history
- [x] Session replay (rrweb)
- [x] A/B testing UI
- [x] Custom dashboards (drag-and-drop grid)
- [x] Event notifications
- [x] AI chat interface
- [x] Data import wizard
- [x] Multi-org / multi-project support
- [x] Dark/light mode
- [x] Responsive design (mobile + desktop)

### Shared Packages
- [x] `@openpanel/auth` — Session management
- [x] `@openpanel/common` — Utilities
- [x] `@openpanel/constants` — Enums/constants
- [x] `@openpanel/db` — Database layer (Prisma + ClickHouse)
- [x] `@openpanel/email` — Email templates (Resend)
- [x] `@openpanel/geo` — GeoIP lookup
- [x] `@openpanel/importer` — Data importers
- [x] `@openpanel/integrations` — Third-party integrations
- [x] `@openpanel/js-runtime` — Sandboxed JS executor (AST validator)
- [x] `@openpanel/json` — JSON utilities
- [x] `@openpanel/logger` — Winston logger
- [x] `@openpanel/payments` — Billing abstraction
- [x] `@openpanel/queue` — BullMQ queue definitions
- [x] `@openpanel/redis` — Redis client wrapper
- [x] `@openpanel/trpc` — tRPC router
- [x] `@openpanel/validation` — Zod schemas

### SDKs
- [x] `@openpanel/web` — Browser JS SDK
- [x] `@openpanel/sdk` — Core SDK
- [x] `@openpanel/nextjs` — Next.js SDK
- [x] `@openpanel/nuxt` — Nuxt SDK
- [x] `@openpanel/astro` — Astro SDK
- [x] `@openpanel/react-native` — React Native SDK
- [x] `@openpanel/express` — Express SDK

### Documentation (this fork — added by Zyniq)
- [x] `/docs/README.md` — Documentation index
- [x] `/docs/01-project-overview.md` — Project goals and features
- [x] `/docs/02-architecture.md` — System architecture and data flow
- [x] `/docs/03-apps.md` — Apps detailed reference
- [x] `/docs/04-packages.md` — Packages detailed reference
- [x] `/docs/05-infrastructure.md` — Docker, DBs, env vars, deployment
- [x] `/docs/06-development-guide.md` — Developer setup and workflow
- [x] `/docs/07-api-reference.md` — API routes and tRPC reference
- [x] `/docs/08-bun-migration-analysis.md` — Bun runtime feasibility study
- [x] `/docs/09-branding-brief.md` — Agent-ready branding brief for Zyniq

---

## 🔵 IN PROGRESS — Zyniq Customization

### Branding (COMPLETE — applied by agent)
- [x] Replace OpenPanel logo with Zyniq logo (`logo.tsx` → Zyniq CDN assets)
- [x] Update color system to Zyniq brand palette (pending CSS token update in `styles.css`)
- [x] Replace "OpenPanel" text references in dashboard
- [x] Update page title and meta tags (`__root.tsx`, `title.ts`)
- [x] Login navbar links updated to `zyniq.solutions`
- [x] Public page footer updated to Zyniq brand
- [x] Badge widget updated to Zyniq brand
- [x] Update favicon files in `apps/start/public/` (Automated in deploy/setup.sh)
- [ ] Update email templates with Zyniq branding (`packages/email/`)
- [ ] Update marketing site branding (`apps/public/`)

### Configuration
- [ ] Set production environment variables
- [ ] Configure domain names (DASHBOARD_URL, NEXT_PUBLIC_API_URL)
- [ ] Set up production databases (PostgreSQL, ClickHouse, Redis)
- [ ] Configure SSL/TLS via reverse proxy
- [ ] Set up COOKIE_SECRET for production
- [ ] Configure OAuth app credentials (GitHub, Google)
- [ ] Configure Resend email API key
- [ ] Configure AI API keys (Anthropic/OpenAI) if AI features are needed

---

## 🔴 TODO — Production Deployment

### Server Setup
- [ ] Provision Linux server with sufficient RAM (min 4GB, recommend 8GB+)
- [ ] Install Docker + Docker Compose on server
- [ ] Build production Docker images
- [ ] Set up reverse proxy (nginx or Traefik) with SSL
- [ ] Configure domain DNS records
- [ ] Run first-time database migration (`pnpm migrate:deploy`)
- [ ] Test all health endpoints

### Security Hardening
- [ ] Rotate all default credentials (PostgreSQL, ClickHouse)
- [ ] Enable firewall — only expose ports 80, 443 (and 22 for SSH)
- [ ] Do NOT expose internal ports (5432, 6379, 8123, 9000) to public internet
- [ ] Set strong `COOKIE_SECRET`
- [ ] Review and tighten CORS origins
- [ ] Enable rate limiting tuning for production traffic

### Monitoring & Ops
- [ ] Set up uptime monitoring (check /healthz/live)
- [ ] Set up Prometheus + Grafana for metrics (optional)
- [ ] Configure log aggregation (optional — HyperDX support built-in)
- [ ] Set up database backups (PostgreSQL + ClickHouse)
- [ ] Define backup retention policy

### Testing
- [ ] End-to-end test the event ingestion flow
- [ ] Test SDK integration in a real browser
- [ ] Test user login / OAuth flows
- [ ] Test email delivery
- [ ] Load test event ingestion endpoint

---

## 📋 KNOWN ISSUES / TECH DEBT

| Issue | Severity | Notes |
|-------|---------|-------|
| `COREPACK_INTEGRITY_KEYS=0` workaround in Dockerfiles | Low | Temporary fix for corepack bug — monitor for upstream fix |
| Native addons require build tools (python3, make, g++) | Low | Necessary for argon2, sharp, bcrypt — keep in Dockerfiles |
| `start_deprecated` script in apps/start | Low | Left-over deprecated script — can be removed |
| Marketing site (`apps/public`) is Next.js while dashboard is TanStack Start | Medium | Two different frameworks to maintain |
| BullMQ depends on Express for BullBoard | Low | Express is a heavy dependency just for the admin UI |
| `BATCH_SIZE=5000` and `BATCH_INTERVAL=10000` hardcoded defaults | Low | Tune for production traffic volume |

---

## 🚫 NOT DOING (FULL MIGRATION)

| Item | Reason |
|------|--------|
| Full Production Bun Migration | Prisma & Sharp blockers — implemented "Bun-safe" hybrid support instead. |
| Migrate to Bun as package manager | pnpm workspace catalog feature is incompatible |
| Upgrade from pnpm to npm/yarn | pnpm performance and workspace features are critical to this monorepo |

## 🟡 COMPROMISE: Bun-Safe Hybrid Mode (Applied)
- [x] Dual-runtime password hashing (`packages/auth`)
- [x] Conditional `source-map-support` for Bun compatibility
- [x] `bunfig.toml` added for local Bun development
- [x] `deploy/setup.sh` updated with optional Bun installation
- [x] `docs/09-bun-development.md` guide created
