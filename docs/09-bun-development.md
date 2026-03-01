# Bun Development Guide

This project is now "Bun-safe," meaning you can use [Bun](https://bun.sh) for development, though Node.js is still recommended for production due to specific native-addon blockers.

## What's been added?

- **`bunfig.toml`**: Configures Bun to respect the workspace structure.
- **`bun.lockb`**: A binary lockfile for Bun, ensuring fast and consistent installs.
- **Dual-Runtime Password Hashing**: `packages/auth` now automatically uses `Bun.password` when running in Bun, and `@node-rs/argon2` in Node.js.
- **Optimized Entry Points**: `source-map-support` is only installed when running in Node.js, as Bun handles this natively.

## Developing with Bun

### Installation
```bash
bun install
```

### Running the API/Worker
You can run the TypeScript files directly with Bun:
```bash
bun run apps/api/src/index.ts
bun run apps/worker/src/index.ts
```

### Running Tests
```bash
bun test packages/auth/src/password.test.ts
```

## Production Status

> [!WARNING]
> **Do NOT use Bun for production yet.**
> While the code is Bun-safe, several critical dependencies (Prisma, Sharp, Argon2 native addons) are not yet fully stable or officially supported in Bun for production workloads. Continue using Node.js 22 for production deployments.

Reference: [docs/08-bun-migration-analysis.md](file:///home/admin_ibrahim/Desktop/openpanel-zyniq-version/docs/08-bun-migration-analysis.md)
