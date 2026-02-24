# 📱 Circuit Copilot

Welcome to the official repository. This application is a full-stack solution built with **Express**, **Expo**, and **PostgreSQL**, organized in a **monorepo** with **Turborepo** and **Docker**.

> [!TIP]
> This project uses **Turborepo** to manage the monorepo. You can run commands from the root and they will be applied to all packages efficiently.

## 🗺️ Documentation Map

To ensure a smooth development process and perfect integration with AI agents, we maintain a "Source of Truth" in the following directories:

### 🧠 Project Context (AI-Ready)

- **[System Prompt](docs/product/system-prompt.md)**: Code style guidelines and agent behavior.
- **[Architecture](docs/architecture/architecture.md)**: Technical structure and data flow details.
- **[User Journeys](docs/product/user-journeys.md)**: Business logic and main user flows.
- **[Mobile Best Practices](docs/guides/mobile-best-practices.md)**: Expo guidelines and code style.

### 🛠️ Specifications and Guides

- **[Setup Guide](docs/guides/setup-guide.md)**: How to set up the local environment with Docker.
- **[Deployment Guide](docs/guides/deployment.md)**: How to take the application to production.
- **[Contributor Guide](docs/guides/contributing.md)**: Rules for branches, commits, and Pull Requests.

## ⚡ Quick Start

> [!IMPORTANT]
> Make sure you have **Docker Desktop**/**Docker Compose** and **Node.js** (v18+) installed before starting.

1.  **Install**: `npm install` at the root.
2.  **Infrastructure**: `docker compose up -d` to start PostgreSQL and PostGIS.
3.  **Mobile Build**: `npm run android -w mobile` (Run this at least once to create the Development Build).
4.  **Development**: `npm run dev` to start all services (API + Mobile) simultaneously.

## 🛠️ Available Commands (Root)

You can manage the entire project directly from the root of the monorepo:

| Command                  | Description                                                 |
| :----------------------- | :---------------------------------------------------------- |
| `npm run dev`            | Starts development mode for API and Mobile.                 |
| `npm run build`          | Compiles all packages and applications.                     |
| `npm run lint`           | Runs the linter across the entire project.                  |
| `npm run test`           | Runs unit and integration tests.                            |
| `npm run format`         | Formats code across the entire project with Prettier.       |
| `npm run <cmd> -w <pkg>` | Runs a specific command in a workspace (e.g., `-w mobile`). |

## 🧪 Infraestructura de Proves

Hem implementat una arquitectura de proves dual professional a `apps/mobile`:

- **Logic Engine (Vitest):** Per a proves ràpides de lògica, utilitats i hooks.
  - Comanda: `npm run test:logic -w mobile`
- **UI Engine (Jest + RTL):** Per a validació de components i interfície d'usuari Expo.
  - Comanda: `npm run test:components -w mobile`
- **Full Suite:** `npm run test -w mobile`

Més detalls al **[Protocol de QA](docs/guides/qa-testing-guide.md)**.

## 🏗️ Refactorització i Estat del Codi

Recentment hem millorat la mantenibilitat de l'aplicació mòbil:

- **Extracció de Lògica:** S'han desacoblat els controls del mapa i els serveis de localització de la vista principal (`MapScreen`) mitjançant hooks personalitzats (`useLocationService`, `useMapControls`).
- **SSOT de Disseny:** S'està implementant un sistema de Single Source of Truth per a colors i tipografia segons la **[Guia de Disseny](docs/guides/design-system.md)**.

### 🗄️ Database Management

> [!CAUTION]
> Use `migrate` with caution in production environments.

- `npm run generate`: Generates Drizzle migration files based on the schema.
- `npm run migrate`: Applies pending migrations to the database.
- `npm run studio`: Opens the Drizzle visual interface to explore data.

## 🛠️ Technology Stack

- **Frontend:** React Native via Expo (`apps/mobile`).
- **Backend:** Node.js Microservices (`apps/server/*`).
- **Shared:** Common types and logic (`packages/shared`).
- **Infrastructure:** Postgres + PostGIS via Docker (`packages/db`).
