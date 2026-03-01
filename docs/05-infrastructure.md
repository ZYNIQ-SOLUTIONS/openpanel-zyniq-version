# 🐳 Infrastructure – OpenPanel Zyniq

## Docker Compose (Development)

File: `docker-compose.yml`

### Services

#### `op-db` — PostgreSQL 14
```yaml
image: postgres:14-alpine
ports: 5432:5432
credentials: postgres/postgres
data: ./docker/data/op-db-data
```
Stores all relational data: users, organizations, projects, clients, dashboards, sessions, settings.

#### `op-kv` — Redis 7.2.5
```yaml
image: redis:7.2.5-alpine
ports: 6379:6379
policy: noeviction
data: ./docker/data/op-kv-data
```
Used for:
- Queue storage (BullMQ jobs)
- Cache layer
- Pub/Sub for real-time live data
- Session caching

#### `op-ch` — ClickHouse 25.10.2.65
```yaml
image: clickhouse/clickhouse-server:25.10.2.65
ports: 8123 (HTTP), 9000 (TCP), 9009 (inter-server)
data: ./docker/data/op-ch-data
```
Stores all analytics event data. Optimized for time-series / analytical queries (funnels, cohorts, retention, etc.).

**Init script**: `docker/clickhouse/init-db.sh` — creates the `openpanel` database on first startup.

---

## Production Dockerfiles

All three server apps have multi-stage Dockerfiles.

### Shared Pattern
```
Stage 1: base    → Node.js 22 slim + pnpm via corepack
Stage 2: build   → Install all deps → run codegen → build app
Stage 3: prod    → Install ONLY prod deps
Stage 4: runner  → Combine built artifacts + prod node_modules
```

### Base Image
```dockerfile
ARG NODE_VERSION=22.20.0
FROM node:22.20.0-slim
```

> ⚠️ **Important for production**: The Dockerfiles install `python3`, `make`, `g++` in the build stage because some native addons (`bcrypt`, `argon2`, `sharp`, `esbuild`) require compilation.

### Start Server (Dashboard)
- **Start command**: `node .output/server/index.mjs`
- **Output dir**: `.output/` (Nitro/TanStack Start output)
- **Also has**: `dist/` directory

### API Server
- **Start command**: `pnpm start` → `node dist/index.js`
- **Exposes**: Port 3000 (mapped externally to 3333)

### Worker
- **Start command**: `node dist/index.js`
- **Exposes**: Port 3000 (mapped externally to 9999)

---

## Environment Variables

All configuration is done via a single root `.env` file, loaded by `dotenv-cli`.

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/postgres?schema=public` |
| `DATABASE_URL_DIRECT` | Direct PostgreSQL URL (for migrations) | Same as `DATABASE_URL` |
| `CLICKHOUSE_URL` | ClickHouse HTTP URL | `http://localhost:8123/openpanel` |
| `REDIS_URL` | Redis connection URL | `redis://127.0.0.1:6379` |
| `API_PORT` | API server port | `3333` |
| `WORKER_PORT` | Worker BullBoard UI port | `9999` |
| `NEXT_PUBLIC_DASHBOARD_URL` | Dashboard public URL | `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | API public URL | `http://localhost:3333` |

### Optional Variables

| Variable | Description |
|----------|-------------|
| `COOKIE_SECRET` | Secret for signing session cookies |
| `API_HOST` | API bind host (default: `0.0.0.0` in prod, `localhost` in dev) |
| `API_CORS_ORIGINS` | Comma-separated additional allowed CORS origins |
| `DEMO_USER_ID` | Enable single-user demo mode (no auth required) |
| `BATCH_SIZE` | Event batch flush size (default: 5000) |
| `BATCH_INTERVAL` | Event batch flush interval ms (default: 10000) |
| `CONCURRENCY` | Worker job concurrency (default: 10) |
| `DASHBOARD_URL` | Alias for `NEXT_PUBLIC_DASHBOARD_URL` |

### AI Variables (if using AI features)
| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Anthropic Claude API key |
| `OPENAI_API_KEY` | OpenAI API key |

### Email Variables
| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Resend email API key |

### OAuth Variables (for social login)
| Variable | Description |
|----------|-------------|
| `GITHUB_CLIENT_ID` + `GITHUB_CLIENT_SECRET` | GitHub OAuth app |
| `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` | Google OAuth app |

---

## Production Deployment (Self-Hosting)

### Recommended Setup

```
┌─────────────────────────────────────────────┐
│              Reverse Proxy (nginx/Traefik)   │
│   dashboard.yourdomain.com → :3000 (start)  │
│   api.yourdomain.com       → :3333 (api)    │
└─────────────────────────────────────────────┘
         │                    │
┌─────────────────┐  ┌──────────────────┐
│  apps/start     │  │  apps/api        │
│  (Dashboard)    │  │  (API Server)    │
│  :3000          │  │  :3333           │
└─────────────────┘  └──────────────────┘
                              │
┌────────────┬────────────────┴───────────┐
│ PostgreSQL │    ClickHouse              │
│ :5432      │    :8123                   │
└────────────┴───────────────────────────┘
         │
    ┌─────────┐       ┌─────────────────┐
    │  Redis  │───────│  Worker         │
    │  :6379  │       │  BullMQ jobs    │
    └─────────┘       │  BullBoard :9999│
                      └─────────────────┘
```

### Steps

1. Set up databases (PostgreSQL, ClickHouse, Redis) — managed services or Docker
2. Build Docker images for `api`, `start`, `worker`
3. Run migrations: `pnpm migrate:deploy`
4. Start services
5. Configure reverse proxy for SSL termination

### Self-Hosting Scripts
See `self-hosting/` directory and `sh/` for deployment shell scripts.

---

## Monitoring

- **BullBoard**: `http://worker-host:9999` — visual queue monitor
- **Prometheus**: `http://api-host:3333/metrics` — Prometheus-compatible metrics
- **Healthchecks**:
  - `GET /healthcheck` — basic health
  - `GET /healthz/live` — liveness probe (Kubernetes)
  - `GET /healthz/ready` — readiness probe (Kubernetes)
