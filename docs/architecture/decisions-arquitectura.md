# Decisions d'Arquitectura: Nomenclatura, Estructura i Versionat

Aquest document detalla les convencions i decisions estratègiques preses per garantir la robustesa i escalabilitat del projecte.

## 1. Backend: Carpeta `apps/server`

S'utilitza `server` com a contenidor de tots els microserveis del backend per diferenciar clarament el codi de servidor del codi mòbil.

## 2. Frontend: Estructura de `apps/mobile`

S'utilitza una separació clara entre la navegació i la lògica per optimitzar el rendiment i la claredat:

- **`/app`**: EXCLUSIVAMENT per a rutes i layouts (Expo Router). Conté els fitxers de navegació com `_layout.tsx`, `index.tsx` i subcarpetes de ruta (ex: `(auth)/login.tsx`).
- **`/src`**: Tota la lògica de negoci, components reutilitzables i estils de l'aplicació.
  - **`components/`**: Components UI base (Botons, Inputs, Cards).
  - **`hooks/`**: Lògica de dades (Data Logic), estat global (Zustand) i custom hooks.
  - **`services/`**: Trucades a l'API (Fetch/Axios) i serveis externs.
  - **`styles/`**: Temes, colors, tipografies i variables de disseny globals.

### Tipografia (Design Tokens)

Per garantir el màxim rendiment, no utilitzem un component `Typography` personalitzat. Utilitzem **Tailwind Design Tokens** configurats a `tailwind.config.js`. Això permet usar el component `Text` estàndard amb classes semàntiques (`text-h1`, `text-body`, etc.).
village

## 3. Versionat de l'API (`/v1`)

Totes les rutes de comunicació externa utilitzen el prefix `/api/v1`.

### Per què és important?

1. **Retrocompatibilitat**: Permet que versions antigues de l'app segueixin funcionant amb `v1` mentre els nous usuaris utilitzen una futura `v2`.
2. **Escalabilitat**: Facilita l'evolució de l'API sense trencar integracions existents.
3. **Estàndard Professional**: Segueix les millors pràctiques d'empreses com Stripe, Twilio o GitHub.

### Implementació al Gateway

El Gateway central està configurat per encaminar tant les rutes amb prefix `/api/v1` com les rutes directes, assegurant una transició suau.

## 4. Pivot de Motor de Mapes: De Mapbox a MapLibre

S'ha decidit migrar de `@rnmapbox/maps` a `@maplibre/maplibre-react-native`.

### Motius de la decisió:

1. **Llibertat i Cost**: Evitem el bloqueig de proveïdor (vendor lock-in) y la necessitat de tokens de pagament per a builds nacionals/bàsiques.
2. **Escalabilitat Open Source**: MapLibre permet una personalització total dels estils (JSON) sense limitacions de servei.
3. **Optimització**: L'arquitectura actual permet un renderitzat fluid de mapes "Digital Non-Real" a escala exacta sense dependències externes pesades.

## 5. Geolocalització i Permisos

S'ha escollit `expo-location` per sobre de `react-native-geolocation-service`.

### Raons:

1. **Consistència Expo**: Millor integració amb el cicle de vida d'Expo i les configuracions de `app.json`.
2. **Gestió de Permisos**: Facilita la sol·licitud de permisos tant en primer com en segon pla (foreground/background) de manera unificada.

## 6. Rendiment del Mapa en Android

S'ha activat `surfaceView={true}` forçadament a Android.

### Context:

Per defecte, MapLibre utilitza `TextureView`, que pot causar lag en el renderitzat quan es combina amb altres capes d'UI complexes en React Native. `SurfaceView` ofereix un canal de renderitzat directe a la GPU, reduint el lag significativament.
