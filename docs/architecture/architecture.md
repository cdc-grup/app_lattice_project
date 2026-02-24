# Arquitectura: Circuit Copilot

## Definició de l'Stack Tecnològic

- **Framework Mòbil:** Expo (React Native).
  - **IMPORTANT:** Tots els paquets de dependències han de ser compatibles amb Expo. S'ha de prioritzar sempre l'ús de `npx expo install` en comptes de `npm install` per garantir la compatibilitat de versions.
  - **Development Builds:** A causa de l'ús de mòduls natius personalitzats (MMKV, Nitro, etc.), l'app s'ha d'executar mitjançant **Development Builds** (`npx expo run:android`), no amb l'app estàndard d'Expo Go.
- **Motor de Mapes:** **MapLibre GL** (`@maplibre/maplibre-react-native`).
  - _Motiu:_ Arquitectura Open Source, d'alt rendiment i sense dependència forçada de tokens de pagament per al desenvolupament base. Permet estils "Digital Non-Real" personalitzats.
- **Motor d'AR:** **ViroCommunity (ViroReact)**.
  - _Motiu:_ Suport natiu per a objectes 3D geo-anclats (Location-based AR).
- **Backend:** Node.js (Express).
- **Base de dades:** PostgreSQL amb l'extensió **PostGIS** activada.
  - _Notes d'Esquema:_ La taula `tickets` defineix el `userId` com a opcional. Això permet pre-carregar entrades vàlides al sistema i associar-les als usuaris posteriorment a l'escanejar el QR.
- **Temps real:** Socket.io amb analitzador **MessagePack** (per a compressió binària).

## Conceptes Tècnics Detallats

- [**Gestió d'Estat**](./state-management.md): Estratègia amb React Query i Zustand.
- [**Estratègia Offline**](./offline-strategy.md): Com funciona l'app sense connexió.
- [**Localització**](../guides/i18n-localization.md): Gestió multi-idioma.
- [**Bones Pràctiques**](../guides/mobile-best-practices.md): Estàndards de codi React Native.
- [**Desplegament**](../guides/deployment-eas.md): Distribució amb Expo EAS.

## Estratègia d'Eficiència de Dades (Entorn d'Alta Densitat)

1. **Limitació de Telemetria:**
   - El client envia actualitzacions de GPS NOMÉS si: `delta_distance > 15m` O `delta_time > 45s`.
   - Evita la saturació de la xarxa durant els esdeveniments de la cursa.
2. **Offline First:**
   - Els estils de mapa i els POIs estàtics (lavabos, portes) es descarreguen durant l'Onboarding.
   - L'ús de dades en temps d'execució es limita a: Posicions d'amics i actualitzacions de congestió.
3. **Càlcul d'Enrutament Local:**
   - El càlcul de rutes es realitza al dispositiu utilitzant el graf de navegació descarregat.
   - El servidor només envia "Blocked Edges" (camins congestionats) per actualitzar els pesos del graf local.

## Estratègia de Contenidors i Entorn

- **Backend (API) i Base de dades:** Dockeritzat utilitzant **Docker Compose**.
  - _PostgreSQL/PostGIS:_ Imatge oficial.
  - _API:_ Dockerfile multi-etapa (dev/prod).
- **Frontend (Mòbil):** Execució nativa (fora de Docker) per optimitzar la connexió amb Metro Bundler i els dispositius físics.
