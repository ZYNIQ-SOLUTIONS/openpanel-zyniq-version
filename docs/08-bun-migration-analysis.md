# 🟡 Bun Runtime Migration Analysis

> **Status**: NOT RECOMMENDED for production — see findings below
> **Date**: 2026-02-28
> **Analyst**: Antigravity (Zyniq AI Agent)

---

## Executive Summary

The current project uses **Node.js 22.20.0** with **pnpm 10.6.2** as the JavaScript runtime and package manager. This analysis evaluates whether migrating the backend services (`apps/api` and `apps/worker`) to [Bun](https://bun.sh) is feasible for **production use** on your server.

> **Verdict**: ⚠️ **Do NOT migrate to Bun for production at this time.** Bun has significant compatibility blockers with critical dependencies in this project. Proceed with Node.js 22 LTS for production deployment.

---

## What Bun Is

Bun is an all-in-one JavaScript runtime that:
- Runs TypeScript natively (no separate build step needed)
- Includes a built-in package manager (`bun install`)
- Has a built-in test runner (`bun test`)
- Is generally **3–5x faster** than Node.js for startup and many workloads
- Aims to be largely compatible with Node.js APIs

---

## Current Runtime Usage

| App | Runtime | Build Tool | Start Method |
|-----|---------|-----------|-------------|
| `apps/api` | Node.js 22 | tsdown (esbuild) | `node dist/index.js` |
| `apps/worker` | Node.js 22 | tsdown (esbuild) | `node dist/index.js` |
| `apps/start` | Node.js 22 | Vite 6 | `node .output/server/index.mjs` |

---

## Dependency Compatibility Analysis

### ❌ BLOCKERS — Will NOT work with Bun

#### 1. `@node-rs/argon2` — **CRITICAL BLOCKER**
- **Used in**: `apps/api` (password hashing)
- **Problem**: This is a native Node.js addon (`.node` file). Bun has **partial** native addon support (NAPI) but `@node-rs/argon2` uses Rust-compiled binaries distributed as platform-specific npm packages.
- **Bun compatibility**: Unreliable / untested for this package
- **Impact**: 🔴 Authentication is completely broken without this

#### 2. `sharp` — **HIGH RISK**
- **Used in**: `apps/api` (image processing)
- **Problem**: `sharp` is a native addon wrapping libvips. It often fails or has degraded functionality under Bun's NAPI emulation.
- **Bun compatibility**: ⚠️ Some versions work, many do not
- **Impact**: 🟠 Image-related features fail

#### 3. `bcrypt` — **HIGH RISK**
- **Used in**: root `trustedDependencies`
- **Problem**: Native C++ addon. Bun's NAPI compatibility hit-or-miss.
- **Impact**: 🟠 Depends on how it's used

#### 4. `prisma` and `@prisma/client` — **HIGH RISK**
- **Used in**: `packages/db` (main ORM)
- **Problem**: Prisma v6 uses a native Rust query engine (Prisma Engines). Bun support for Prisma is experimental. The `db:codegen` step in Dockerfiles may fail. Migrations may fail.
- **Status**: Prisma officially says Bun support is "experimental"
- **Impact**: 🔴 The entire database layer depends on this

#### 5. `@clickhouse/client` — **UNKNOWN**
- **Used in**: `packages/db`
- **Problem**: This is a pure JavaScript package but its Node.js stream handling may differ
- **Impact**: 🟡 Likely works but untested

#### 6. `bullmq` — **MODERATE RISK**
- **Used in**: `apps/worker`
- **Problem**: BullMQ v5 is not officially tested on Bun. Redis connection (ioredis) may have compatibility issues.
- **Impact**: 🟠 Background job processing broken

#### 7. `@fastify/websocket` — **MODERATE RISK**
- **Used in**: `apps/api`
- **Problem**: WebSocket handling in Bun uses a different low-level API. `@fastify/websocket` wraps the `ws` package which has Node.js stream assumptions.
- **Impact**: 🟠 Real-time dashboard feed broken

#### 8. `source-map-support` — **MINOR RISK**
- **Used in**: `apps/api`, `apps/worker`
- **Problem**: Bun has built-in source map support, so this package is redundant and may conflict.
- **Impact**: 🟡 Minor — can be removed if using Bun

### ✅ COMPATIBLE — Should work fine with Bun

| Package | Notes |
|---------|-------|
| `fastify` | Bun can run Fastify. Core HTTP layer works. |
| `@trpc/server` | Pure TypeScript — works fine |
| `zod` | Pure TypeScript — works fine |
| `date-fns` | Pure JS — works fine |
| `ramda` | Pure JS — works fine |
| `uuid` | Pure JS — works fine |
| `superjson` | Pure JS — works fine |
| `jsonwebtoken` | JS — mostly works |
| `redis` (ioredis) | Works with some caveats |
| `winston` | Mostly works |

---

## pnpm vs Bun as Package Manager

Separately from the runtime question, you could use **Bun as a package manager** (replacement for pnpm) while still running on **Node.js**. However:

- The project uses `pnpm workspaces` with `pnpm-workspace.yaml`
- The `package.json` specifies `"packageManager": "pnpm@10.6.2"` — this is enforced by corepack
- Bun's workspace support is different and not directly compatible with pnpm workspace catalog feature (used for `zod`, `react`, `typescript` version pinning in `pnpm-workspace.yaml`)
- **Verdict**: ❌ Keep pnpm — migrating workspace config to Bun workspaces would require significant rework

---

## Performance Context

Bun's performance advantages are most pronounced for:
- Cold start time (Bun ~3-10x faster than Node.js)
- `bun install` (5-10x faster than pnpm install)
- Simple HTTP servers

For **this project's workloads** (ClickHouse queries, Prisma/PostgreSQL, Redis I/O, BullMQ job processing), the bottleneck is **I/O and database latency**, not JavaScript execution speed. The real-world performance gain from Bun would be minimal while the compatibility risks are very high.

---

## What Would Need to Change for Bun Migration

If you want to attempt Bun in the future (after blockers are resolved):

### Must Replace / Remove
1. `@node-rs/argon2` → Replace with `oslo/password` + a Bun-compatible argon2 implementation
2. `sharp` → Replace with Bun's native `sharp` build or use a Cloudflare Images API instead
3. `bcrypt` → Replace with `oslo/password` which uses pure WebCrypto
4. `prisma` → Wait for official Bun support, or migrate to Drizzle ORM (Bun-native)
5. `source-map-support` → Remove (Bun handles this natively)

### Build System Changes
- Remove `tsdown` — Bun can run TypeScript natively, no compilation step needed
- Update Dockerfiles to use `oven/bun:1` base image
- Change start commands: `bun run src/index.ts` (no build step)
- Update `package.json` `packageManager` field

### Docker Changes
```dockerfile
# Replace
FROM node:22.20.0-slim
# With
FROM oven/bun:1-slim
```

---

## Recommendation

| Option | Verdict | Effort |
|--------|---------|--------|
| Keep Node.js 22 (current) | ✅ Best for production | None |
| Migrate to Bun runtime | ❌ Too many blockers | Very high, 6+ weeks |
| Use Bun as package manager only | ❌ Workspace incompatibility | High, 2-3 weeks |
| Upgrade Node.js version | ✅ Safe improvement | Minimal (already current) |

**Action**: Continue using Node.js 22.20.0 + pnpm 10.6.2. This is a mature, stable, production-ready configuration. Revisit Bun after Prisma official Bun support is released (watch: https://github.com/prisma/prisma/issues/21310).

---

## Monitoring Bun Compatibility Status

Track these issues to know when migration becomes viable:
- [Prisma + Bun](https://github.com/prisma/prisma/issues/21310)
- [BullMQ + Bun](https://github.com/taskforcesh/bullmq/issues)
- [Bun NAPI status](https://github.com/oven-sh/bun/issues/158)
