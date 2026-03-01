# 📱 Apps Reference – OpenPanel Zyniq

## Overview

The project contains **5 apps** under `apps/`:

| App | Path | Purpose | Port |
|-----|------|---------|------|
| `api` | `apps/api` | Core backend – REST + tRPC server | 3333 |
| `start` | `apps/start` | Dashboard frontend (TanStack Start / React) | 3000 |
| `worker` | `apps/worker` | Background job processor (BullMQ) | 9999 (BullBoard UI) |
| `public` | `apps/public` | Marketing/documentation website (Next.js) | — |
| `justfuckinguseopenpanel` | `apps/justfuckinguseopenpanel` | Minimal demo/usage landing | — |

---

## `apps/api` — Fastify Backend

**Runtime**: Node.js 22 · **Build**: `tsdown` (esbuild-based TypeScript bundler)

### What It Does
- Receives analytics events from SDK clients
- Serves the tRPC API consumed by the dashboard
- Handles OAuth callbacks, webhooks (Svix), AI chat, live WebSocket data
- Exposes Prometheus metrics

### Key Files
| File | Description |
|------|-------------|
| `src/index.ts` | Server bootstrap — Fastify instance, all plugin registrations, graceful shutdown |
| `src/routes/event.router.ts` | SDK event ingestion endpoint |
| `src/routes/track.router.ts` | Page/session tracking |
| `src/routes/ai.router.ts` | AI (Anthropic/OpenAI) routes |
| `src/routes/live.router.ts` | Real-time WebSocket feed |
| `src/routes/manage.router.ts` | Client/project management |
| `src/routes/webhook.router.ts` | External webhook receiver |
| `src/routes/oauth-callback.router.ts` | OAuth provider callbacks |
| `src/hooks/ip.hook.ts` | IP resolution (for geo) |
| `src/hooks/request-logging.hook.ts` | Structured request logging |
| `src/controllers/healthcheck.controller.ts` | `/healthcheck`, `/healthz/live`, `/healthz/ready` |
| `src/utils/graceful-shutdown.ts` | SIGTERM/SIGINT handler |

### Plugin Stack
- `@fastify/cors` — per-path CORS (restrictive for dashboard, wildcard for SDK)
- `@fastify/cookie` — signed session cookie parser
- `@fastify/compress` — gzip/deflate (opt-in per route)
- `@fastify/rate-limit` — rate limiting
- `@fastify/websocket` — WebSocket support
- `fastify-metrics` — Prometheus metrics endpoint
- `fastify-raw-body` — raw body access (for webhook HMAC validation)
- `@trpc/server` — tRPC adapter

### Body Size Limit
500MB (`bodyLimit: 1_048_576 * 500`) — needed for large event imports.

### CORS Policy
- `/trpc`, `/live`, `/webhook`, `/oauth`, `/misc`, `/ai` → restricted to `DASHBOARD_URL` + `API_CORS_ORIGINS`
- All other routes → `origin: '*'` (public SDK endpoints)

### Environment
```
API_PORT=3333
API_HOST=0.0.0.0 (production) / localhost (dev)
COOKIE_SECRET=...
DASHBOARD_URL=...
API_CORS_ORIGINS=... (comma-separated extra origins)
DEMO_USER_ID=... (optional: single-user demo mode)
```

### Docker
- Multi-stage Dockerfile: `base → build → prod → runner`
- Base image: `node:22.20.0-slim`
- Build: `pnpm codegen && pnpm --filter api run build`
- Start: `pnpm start` → `node dist/index.js`

---

## `apps/start` — Dashboard Frontend

**Framework**: TanStack Start (React 19 + SSR) · **Build**: Vite 6 · **Styling**: TailwindCSS v4 + Shadcn/Radix UI

### What It Does
- The main user-facing analytics dashboard
- Connects to `apps/api` via tRPC client
- Real-time data via WebSocket connection to API `/live`
- Full analytics UI: charts, funnels, cohorts, replays, dashboards

### Key Tech
| Library | Purpose |
|---------|---------|
| `@tanstack/react-router` | File-system routing |
| `@tanstack/react-query` | Server state management |
| `@tanstack/react-table` | Data tables |
| `recharts`, `@nivo/sankey`, `d3` | Charts and visualizations |
| `@reduxjs/toolkit` + `react-redux` | Client state |
| `framer-motion` | Animations |
| `@codemirror/*` | Code editor (for AI/custom queries) |
| `rrweb-player` | Session replay player |
| `react-grid-layout` | Draggable dashboard grid |
| `@radix-ui/*` | Accessible UI primitives |
| `lottie-react` | Lottie animations |
| `@sentry/tanstackstart-react` | Error tracking |

### File Structure
```
src/
├── routes/        → 75 route files (file-based routing)
├── components/    → 316 component files
├── hooks/         → 32 custom React hooks
├── modals/        → 33 modal components
├── redux/         → Redux store slices
├── server/        → Server-side entry
├── trpc/          → tRPC client setup
├── utils/         → Utility functions
├── types/         → TypeScript type definitions
├── translations/  → i18n files
├── styles.css     → Global CSS
└── router.tsx     → Router configuration
```

### Deployment Options
1. **Node.js SSR** (primary for self-hosting): `node .output/server/index.mjs`
2. **Cloudflare Workers** (edge): via `wrangler.jsonc` config
3. **Static preview**: `vite preview`

### Environment
```
NEXT_PUBLIC_DASHBOARD_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3333
```

---

## `apps/worker` — Background Job Processor

**Runtime**: Node.js 22 · **Build**: `tsdown`

### What It Does
- Processes all background jobs from BullMQ queues
- Jobs include: email sending, event enrichment, data aggregation, integration webhooks, billing, imports
- Exposes **BullBoard** web UI for queue monitoring on port 9999
- Prometheus metrics via `prom-client`

### Key Dependencies
| Package | Purpose |
|---------|---------|
| `bullmq` | Queue consumer |
| `groupmq` | Grouped queuing |
| `@bull-board/api` + `express` | Queue monitor UI |
| `@openpanel/email` | Email delivery |
| `@openpanel/integrations` | Integration adapters |
| `@openpanel/js-runtime` | Safe JS code execution |
| `@openpanel/importer` | Import job processing |
| `@openpanel/payments` | Billing job handlers |
| `prom-client` | Prometheus metrics |

### Environment
```
WORKER_PORT=9999
```

### Docker
- Base: `node:22.20.0-slim`
- Start: `node dist/index.js`

---

## `apps/public` — Marketing Website

**Framework**: Next.js (static export) · **Content**: Fumadocs (MDX-based docs)

### What It Does
- Marketing landing page for OpenPanel
- Documentation site
- Static content served via CDN / edge

### Key Files
- `source.config.ts` → Fumadocs content config
- `content/` → 132 MDX documentation pages
- `next.config.mjs` → Next.js config
- `open-next.config.ts` → OpenNext.js for edge deployment

---

## `apps/justfuckinguseopenpanel`

A minimal standalone demo app showing how to integrate OpenPanel SDK. Intended for educational/marketing purposes.
