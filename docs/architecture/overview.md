# System Overview: Circuit Copilot

Circuit Copilot is a premium mobile application designed to enhance the spectator experience at high-density events like the Formula 1 Santander Spanish Grand Prix at the Circuit de Barcelona-Catalunya.

## Technology Stack

- **Mobile Framework:** Expo (React Native)
  - **Environment:** Custom Development Builds (required for MMKV, Reanimated, R3F).
- **Map Engine:** MapLibre GL (`@maplibre/maplibre-react-native`).
  - **Optimization:** SurfaceView for maximum GPU performance on Android.
- **Augmented Reality:** React Three Fiber (R3F) for modern, cross-platform AR scenes.
- **Backend:** Node.js (Express) within a microservices architecture.
- **Database:** PostgreSQL with PostGIS extension.
- **Real-time:** Socket.io with MessagePack for binary compression.

## Core Philosophical Pillars

1. **Mixed Style Design:** Fusion of Cupertino elegance and Material structure.
2. **Offline-First:** Critical data (POIs, Map Styles) is cached to survive network saturation.
3. **Location Intelligence:** Efficiency-gated GPS updates and on-device routing calculations.

## Documentation Map

- [**Architecture**](./backend.md): Technical deep-dives into Backend and Frontend systems.
- [**Guides**](../guides/setup.md): Setup, Deployment, and Contribution standards.
- [**API**](../apis/api-contract.md): Data contracts and schema definitions.

---

> For detailed technical decisions and ADRs, see [**Architecture Decisions**](./decisions.md).
