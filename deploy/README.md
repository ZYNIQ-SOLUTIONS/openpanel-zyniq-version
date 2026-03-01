# Zyniq Analytics Deployment Guide

This folder contains everything needed to deploy **Zyniq Analytics** on a fresh Ubuntu 24.04 server.

## 📋 Prerequisites

1.  **Server**: A dedicated server or VPS with Ubuntu 24.04.
2.  **DNS**: Point the following A records (or CNAMEs) to your server's public IP:
    *   `admin.zyniq.cloud`
    *   `api.zyniq.cloud`
    *   `pgadmin.zyniq.cloud`
    *   `mongo.zyniq.cloud`
    *   `qdrant.zyniq.cloud`
    *   `redis.zyniq.cloud`
    *   `kafka.zyniq.cloud`

## 🚀 Quick Start (Recommended)

Run the bootstrap script as root. It will install Docker, clone the repo, generate all secrets, and start the infrastructure.

```bash
curl -fsSL https://raw.githubusercontent.com/ZYNIQ-SOLUTIONS/openpanel-zyniq-version/main/deploy/setup.sh | sudo bash
```

*Note: If you already have the repo cloned, you can run `sudo bash deploy/setup.sh` from the root.*

## 🛠️ Manual Management

### Starting Services

1.  **Infrastructure** (Databases & Proxies):
    ```bash
    cd deploy
    docker compose -f docker-compose.infra.yml --env-file .env up -d
    ```

2.  **Application**:
    ```bash
    cd deploy
    docker compose -f docker-compose.app.yml --env-file .env up -d --build
    ```

### Database Migrations

After the app is running for the first time, run the migrations:
```bash
docker exec analytics-api node dist/migrate.js
```

### Viewing Logs

```bash
docker compose -f docker-compose.app.yml logs -f
```

## 🔐 Credentials

All auto-generated passwords and secrets are stored in `deploy/.env`. 

*   **Database UIs**: Use username `admin` and the `ADMIN_PASSWORD` found in `.env`.
*   **pgAdmin**: Use the email and password defined in `.env`.

## 🔄 Updates

To update the application to the latest version:

```bash
git pull
cd deploy
docker compose -f docker-compose.app.yml up -d --build
docker exec analytics-api node dist/migrate.js
```

## 📁 Directory Structure

*   `setup.sh`: Automated bootstrap script.
*   `docker-compose.infra.yml`: PostgreSQL, ClickHouse, Redis, MongoDB, Qdrant, Kafka, Caddy.
*   `docker-compose.app.yml`: Zyniq Analytics API, Worker, Dashboard.
*   `Caddyfile`: Reverse proxy and TLS configuration.
*   `.env.example`: Template for environment variables.
