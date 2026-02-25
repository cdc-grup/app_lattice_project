# Backend Architecture & Infrastructure

The Circuit Copilot backend is a containerized microservices architecture designed for high availability and fault isolation.

## System Components

```mermaid
graph TD
    Client[Mobile App] --> Gateway
    Gateway -- /auth, /users --> AuthService[Auth Service]
    Gateway -- /pois, /nav --> GeoService[Geo Service]
    Gateway -- /groups --> SocialService[Social Service]

    AuthService --> DB[(PostgreSQL + PostGIS)]
    GeoService --> DB
    SocialService --> DB
```

### 1. API Gateway (`apps/server/gateway`)
The single entry point for all mobile traffic.
- **Responsibility:** Request routing, central security, Rate Limiting, and protocol abstraction.
- **Port:** 3000

### 2. Auth Service (`apps/server/auth`)
Handles user identity and ticket synchronization.
- **Responsibility:** QR ticket linking, user profile management (accessibility preferences), and JWT issuing.
- **Port:** 3001

### 3. Geo Service (`apps/server/geo`)
The spatial brain of the application.
- **Responsibility:** POI delivery (Grandstands, Food, Restrooms), accessibility-aware routing, and personal waypoint storage.
- **Port:** 3002

### 4. Social Service (`apps/server/social`)
Manages real-time interactions.
- **Responsibility:** Group management and high-frequency real-time location sharing via WebSockets (`Socket.io`).
- **Port:** 3003

## Infrastructure & Docker

The entire backend environment is orchestrated via **Docker Compose**.

### Persistent Storage
- **Main DB:** PostgreSQL 15 + PostGIS for spatial queries.
- **Redis (Recommended):** Currently identified as a priority for caching high-frequency telemetry.

### Deployment Environment
- **Containerization:** Multi-stage Docker builds for all custom services.
- **Networking:** Internal bridge network for inter-service communication; external traffic limited to the Gateway.

---
> For setup instructions, see the [**Developer Setup Guide**](../guides/setup.md).
