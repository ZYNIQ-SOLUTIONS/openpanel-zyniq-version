# 📚 Zyniq OpenPanel – Documentation Index

> **Project**: OpenPanel (Zyniq-branded fork)
> **Version**: 1.0.0 (root) | API 0.0.4 | Worker 0.0.3
> **Last Updated**: 2026-02-28
> **Runtime**: Node.js 22.20.0 · pnpm 10.6.2 · TypeScript 5.9+

---

## Table of Contents

| File | Description |
|------|-------------|
| [01-project-overview.md](./01-project-overview.md) | What the project is, its goals, and features |
| [02-architecture.md](./02-architecture.md) | System architecture, monorepo layout, data flow |
| [03-apps.md](./03-apps.md) | Detailed breakdown of every app (api, start, worker, public) |
| [04-packages.md](./04-packages.md) | Shared packages / internal libraries |
| [05-infrastructure.md](./05-infrastructure.md) | Docker, databases, environment variables, deployment |
| [06-development-guide.md](./06-development-guide.md) | How to set up and run the project locally |
| [07-api-reference.md](./07-api-reference.md) | API routes, tRPC endpoints, authentication |
| [08-bun-migration-analysis.md](./08-bun-migration-analysis.md) | Full analysis of switching from Node.js to Bun for production |
| [09-branding-brief.md](./09-branding-brief.md) | Agent-ready brief for re-theming to Zyniq brand |
| [10-todo-and-status.md](./10-todo-and-status.md) | What is done, in progress, and planned |

---

## Quick Facts

- **Type**: Open-source analytics SaaS (self-hostable)
- **Stack**: Fastify, TanStack Start (React), Postgres, ClickHouse, Redis, BullMQ
- **Package Manager**: pnpm (workspace monorepo)
- **Build Tool**: tsdown (server), Vite (dashboard)
- **Deployment**: Docker + Docker Compose
- **License**: MIT (with trademark restrictions on logos/names)
