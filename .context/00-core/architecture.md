# Architecture: Circuit Copilot

## Technology Stack Definition

- **Mobile Framework:** Expo (React Native).
- **Map Engine:** **Mapbox SDK** (`@rnmapbox/maps`).
  - _Reason:_ Necessary for custom vector tiles of the circuit and offline routing graph.
- **AR Engine:** **ViroCommunity (ViroReact)**.
  - _Reason:_ Native support for geo-anchored 3D objects (Location-based AR).
- **Backend:** Node.js (Express).
- **Database:** PostgreSQL with **PostGIS** extension enabled.
- **Real-time:** Socket.io with **MessagePack** analyzer (for binary compression).

## Data Efficiency Strategy (High Density Environment)

1. **Telemetry Limitation:**
   - The client sends GPS updates ONLY if: `delta_distance > 15m` OR `delta_time > 45s`.
   - Avoids network saturation during racing events.
2. **Offline First:**
   - Map styles and static POIs (toilets, gates) are downloaded during Onboarding.
   - Runtime data usage is limited to: Friend positions and congestion updates.
3. **Local Route Calculation:**
   - Route calculation is performed on the device using the downloaded navigation graph.
   - The server only sends "Blocked Edges" (congested paths) to update the local graph weights.

## Container and Environment Strategy

- **Backend (API) & Database:** Dockerized using **Docker Compose**.
  - _PostgreSQL/PostGIS:_ Official image.
  - _API:_ Multi-stage Dockerfile (dev/prod).
- **Frontend (Mobile):** Native execution (outside Docker) to optimize the connection with Metro Bundler and physical devices.
