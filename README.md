# 📱 Circuit Copilot

Welcome to the official repository. This application is a full-stack solution built with **Express**, **Expo**, and **PostgreSQL**, organized in a **monorepo** with **Turborepo** and **Docker**.

> [!TIP]
> This project uses **Turborepo** to manage the monorepo. You can run commands from the root and they will be applied to all packages efficiently.

## 🗺️ Documentation Map

To ensure a smooth development process and perfect integration with AI agents, we maintain a "Source of Truth" in the following directories:

### 🧠 Project Context (AI-Ready)

- **[System Prompt](.context/00-core/system-prompt.md)**: Code style guidelines, language, and agent behavior.
- **[Architecture](.context/00-core/architecture.md)**: Technical structure and data flow details.
- **[User Journeys](.context/01-product/user-journeys.md)**: Business logic and main user flows.

### 🛠️ Specifications and Guides

- **[Setup Guide](docs/SETUP_GUIDE.md)**: How to set up the local environment with Docker.
- **[Deployment Guide](docs/DEPLOYMENT.md)**: How to take the application to production.
- **[Contributor Guide](docs/CONTRIBUTING.md)**: Rules for branches, commits, and Pull Requests.

## ⚡ Quick Start

> [!IMPORTANT]
> Make sure you have **Docker Desktop**/**Docker Compose** and **Node.js** (v18+) installed before starting.

1.  **Install**: `npm install` at the root.
2.  **Infrastructure**: `docker compose up -d` to start PostgreSQL and PostGIS.
3.  **Development**: `npm run dev` to start all services (API + Mobile) simultaneously.

## 🛠️ Available Commands (Root)

You can manage the entire project directly from the root of the monorepo:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts development mode for API and Mobile. |
| `npm run build` | Compiles all packages and applications. |
| `npm run lint` | Runs the linter across the entire project. |
| `npm run test` | Runs unit and integration tests. |
| `npm run format` | Formats code across the entire project with Prettier. |

### 🗄️ Database Management

> [!CAUTION]
> Use `migrate` with caution in production environments.

- `npm run generate`: Generates Drizzle migration files based on the schema.
- `npm run migrate`: Applies pending migrations to the database.
- `npm run studio`: Opens the Drizzle visual interface to explore data.

## 🛠️ Technology Stack

- **Frontend:** React Native via Expo (`apps/mobile`).
- **Backend:** Node.js with Express (`apps/api`).
- **Shared:** Common types and logic (`packages/shared`).
- **Infrastructure:** Postgres + PostGIS via Docker (`packages/db`).
