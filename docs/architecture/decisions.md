# Architecture Decision Records (ADR)

This document tracks the major technical decisions and conventions established for the Circuit Copilot project.

## 1. Directory Structure

- **`/apps/server`**: Contains all containerized microservices.
- **`/apps/mobile/app`**: Native Expo Router file-based routing.
- **`/apps/mobile/src`**: Localized business logic, components, and state.
- **`/packages`**: Shared code and schema definitions.

## 2. API Versioning

All external communications are prefixed with `/api/v1`.
- **Reasoning:** Ensures backward compatibility for older app versions and follows industry standards (Stripe, GitHub) for professional scalability.

## 3. Map Engine Pivot: MapLibre

We migrated from Mapbox to `@maplibre/maplibre-react-native`.
- **Reasoning:** Vendor lock-in avoidance, lower costs for nationwide builds, and total freedom over style JSON customization.

## 4. Location Service: Expo Location

Chosen over standard React Native geolocation.
- **Reasoning:** Seamless integration with the Expo ecosystem and unified permission management for both foreground and background tracking.

## 5. Persistence: MMKV

Used for all client-side storage needs.
- **Reasoning:** Synchronous read/write operations prevent UI flickers and provide ~30x better performance than the deprecated `AsyncStorage`.

## 6. Real-time protocol: MessagePack

Utilized over standard JSON for WebSockets.
- **Reasoning:** Binary compression significantly reduces payload size, which is critical in low-bandwidth, high-density environments like a racing event.

---
> These decisions form the foundation of our scalability strategy.
