# 🛠️ Development Guide – OpenPanel Zyniq

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 22.20.0+ | [nodejs.org](https://nodejs.org) or [`nvm`](https://github.com/nvm-sh/nvm) |
| pnpm | 10.6.2+ | `npm install -g pnpm@10.6.2` |
| Docker | Latest | [docker.com](https://docker.com) |
| Docker Compose | v2+ | Included with Docker Desktop |

---

## Initial Setup

### 1. Install dependencies
```bash
pnpm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your configuration
echo "API_URL=http://localhost:3333" > apps/start/.env
```

### 3. Start infrastructure (databases)
```bash
pnpm dock:up
# Starts: PostgreSQL, Redis, ClickHouse
```

### 4. Generate code (Prisma client + GeoIP data)
```bash
pnpm codegen
```

### 5. Run database migrations
```bash
pnpm migrate:deploy   # First-time setup, deploys all migrations
# OR
pnpm migrate          # Dev mode, interactive migration creation
```

### 6. Start all services in dev mode
```bash
pnpm dev
# Starts: api (port 3333) + worker (port 9999) + start (port 3000) in parallel
```

---

## Access URLs (Development)

| Service | URL | Description |
|---------|-----|-------------|
| Dashboard | http://localhost:3000 | Main analytics dashboard |
| API | http://localhost:3333 | REST + tRPC backend |
| BullBoard | http://localhost:9999 | Queue monitoring UI |
| ClickHouse CLI | `pnpm dock:ch` | ClickHouse terminal |
| Redis CLI | `pnpm dock:redis` | Redis terminal |

---

## Available Scripts

### Root-level `pnpm` scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development (parallel) |
| `pnpm dev:public` | Start only the marketing website |
| `pnpm test` | Run all Vitest tests |
| `pnpm typecheck` | TypeScript type-check all packages |
| `pnpm codegen` | Generate Prisma client + GeoIP data |
| `pnpm migrate` | Create new DB migration (dev) |
| `pnpm migrate:deploy` | Deploy all pending migrations (production) |
| `pnpm dock:up` | Start Docker services |
| `pnpm dock:down` | Stop Docker services |
| `pnpm dock:ch` | Open ClickHouse CLI |
| `pnpm dock:redis` | Open Redis CLI |
| `pnpm check` | Run Biome lint/format check |
| `pnpm fix` | Apply Biome auto-fixes |
| `pnpm check:workspace` | Check workspace for dependency issues |

### Per-app scripts (via `pnpm --filter <app>`)

```bash
# API
pnpm --filter api dev          # Start with watch mode
pnpm --filter api build        # Build for production
pnpm --filter api typecheck    # Type-check

# Dashboard
pnpm --filter start dev        # Start Vite dev server
pnpm --filter start build      # Build for production
pnpm --filter start typecheck  # Type-check

# Worker
pnpm --filter worker dev       # Start with watch mode
pnpm --filter worker build     # Build for production
pnpm --filter worker typecheck # Type-check

# Database
pnpm --filter db codegen       # Generate Prisma client
pnpm --filter db migrate       # Create migration
```

---

## Code Quality

### Format & Lint
```bash
pnpm check    # Check all files with Biome
pnpm fix      # Auto-fix and format
```

### Testing
```bash
pnpm test                   # Run all tests
pnpm --filter db test       # Run DB package tests
pnpm --filter worker test   # Run Worker tests
```

### Type Checking
```bash
pnpm typecheck   # Type-check all packages (continues on error)
```

---

## Git Hooks

Pre-push hook (via `simple-git-hooks`):
```bash
pnpm typecheck && pnpm test
```

To set up:
```bash
pnpm update-simple-git-hooks
```

Skip the hook (e.g., for WIP commits):
```bash
SKIP_HOOKS=1 git push
```

---

## Working with the Database

### Create a new Prisma migration
```bash
pnpm migrate
# or
pnpm --filter db migrate
```

### Apply migrations in production
```bash
pnpm migrate:deploy
# This runs: prisma migrate deploy && code-migrations
```

### Access databases
```bash
pnpm dock:ch      # ClickHouse CLI (database: openpanel)
pnpm dock:redis   # Redis CLI
# PostgreSQL: connect via any Postgres client to localhost:5432
# User: postgres, Password: postgres
```

---

## Adding a New Package

1. Create directory: `packages/new-package/`
2. Create `package.json`:
```json
{
  "name": "@openpanel/new-package",
  "version": "0.0.1",
  "type": "module",
  "main": "index.ts",
  "exports": { ".": "./index.ts" },
  "scripts": { "typecheck": "tsc --noEmit" },
  "devDependencies": {
    "@openpanel/tsconfig": "workspace:*",
    "typescript": "catalog:"
  }
}
```
3. Create `tsconfig.json` extending from `@openpanel/tsconfig`
4. Add to consuming app's `package.json`:
```json
"@openpanel/new-package": "workspace:*"
```
5. Run `pnpm install`

---

## Cloudflare Deployment (Optional)

The API, start app, and public website have `wrangler.jsonc` configs for optional Cloudflare Workers/Pages deployment:

```bash
pnpm --filter start deploy    # Deploy dashboard to Cloudflare
pnpm --filter public deploy   # Deploy marketing site
```
