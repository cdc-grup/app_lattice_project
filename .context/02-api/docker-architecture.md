# Microservices in Docker: Circuit Copilot

This document details the microservices integrated in the Docker environment and those recommended to be added to guarantee system performance in high-density environments.

## 1. Current Microservices in Docker

### `api` (Backend - Node.js/Express)
- **Technology:** Node.js, Express, Socket.io (with MessagePack).
- **Function:** Manages business logic, JWT authentication, ticket synchronization, and real-time telemetry.
- **Docker:** Multi-stage build defined in the application's `Dockerfile`.

### `db` (Database - PostgreSQL)
- **Technology:** PostgreSQL 15 with the **PostGIS** extension.
- **Function:** Persistent storage of Points of Interest (POIs), user data, and geographic metadata.
- **Docker:** Official PostGIS image.

## 2. Recommended Microservices (Detected Gaps)

To comply with high-density requirements (over 100,000 people) and low latency, the integration of the following services is recommended:

### `cache` (Redis)
- **Function:** Manage high-volume GPS position telemetry and live race status without overloading the main database.
- **Benefit:** Drastic reduction of latency in Socket.io updates.

### `db-admin` (Drizzle Studio / pgAdmin)
- **Function:** Graphical interface for data management and database visualization during development.
- **Benefit:** Agility in debugging geographic data.

## 3. Services Outside Docker

### `mobile` (Frontend - Expo/React Native)
- **Reason:** According to the project architecture (`.context/00-core/architecture.md`), the mobile application must run natively to optimize communication with Metro Bundler, accelerometers, GPS, and AR sensors (ViroReact) on physical devices.
