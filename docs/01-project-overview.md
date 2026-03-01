# 📌 Project Overview – OpenPanel (Zyniq Edition)

## What Is This?

This is a **branded fork** of [OpenPanel](https://openpanel.dev) — an open-source, privacy-first web and product analytics platform — customized for **Zyniq Solutions**. It functions as a full **self-hosted analytics SaaS** with feature parity to commercial tools like Mixpanel, PostHog, and GA4.

---

## Goals

- Provide a **fully self-hosted** analytics platform with zero vendor lock-in
- Give **Zyniq Solutions** a white-labeled analytics product under their own brand
- Track user events, sessions, funnels, A/B tests, and cohorts with full GDPR/privacy compliance
- Offer **SDKs** for Web, React Native, iOS (Swift), Android (Kotlin), Next.js, Nuxt, Astro, Express

---

## Core Features

| Feature | Status |
|---------|--------|
| Real-time dashboards | ✅ Done |
| Funnels & cohort analysis | ✅ Done |
| User profiles & session history | ✅ Done |
| Session replay (rrweb) | ✅ Done |
| A/B testing & variant breakdowns | ✅ Done |
| Event & funnel notifications | ✅ Done |
| Cookieless / GDPR-compliant tracking | ✅ Done |
| SDKs: Web, React Native, iOS, Android | ✅ Done |
| AI-powered insights | ✅ Done (Anthropic + OpenAI) |
| Custom dashboards & charts | ✅ Done |
| Import / Export data | ✅ Done |
| OAuth integrations | ✅ Done |
| Payments (billing) | ✅ Done |
| Multi-organization support | ✅ Done |
| Webhook support | ✅ Done |
| Queue monitoring (BullBoard) | ✅ Done |
| Prometheus metrics | ✅ Done |

---

## Who Built This?

- **Original author**: Carl-Gerhard Lindesvärd (Openpanel-dev)
- **This fork**: Prepared and customized by/for Zyniq Solutions
- **License**: MIT (see `LICENSE.md`)
- **Trademark**: OpenPanel name and logos are trademarked (see `TRADEMARK.md`) — Zyniq must rebrand

---

## Tech Snapshot

```
Runtime:      Node.js 22.20.0
Language:     TypeScript 5.9+
Package Mgr:  pnpm 10.6.2 (workspace monorepo)
Frontend:     TanStack Start (React 19) + Vite + TailwindCSS v4
Backend:      Fastify 5 + tRPC 11
Databases:    PostgreSQL 14 (Prisma ORM) + ClickHouse 25.x
Cache/Queue:  Redis 7.2 + BullMQ + GroupMQ
Email:        Resend
Auth:         Oslo + Arctic (OAuth)
AI:           Vercel AI SDK (Anthropic + OpenAI)
```
