# Bones Pràctiques de Desenvolupament Mòbil

Per mantenir el codi net, eficient i fàcil de mantenir.

## 1. Components i UI
- **Atomic Design:** Divideix la UI en components petits i reutilitzables a `src/components`.
- **Tailwind (NativeWind):** Utilitza classes de Tailwind per i estils ràpids, però evita cadenes de classes massa llargues (extreu estil a components si cal).
- **Llistes:** Usa `@shopify/flash-list` per a un scroll suau en llistes de POIs.

## 2. Imatges i Assets
- **Optimització:** Usa `expo-image` per a caching i bones transicions.
- **SVGs:** Usa `react-native-svg` per a icones per evitar pixelat en diferents densitats de pantalla.

## 3. Gestió de Codi
- **Hooks Personalitzats:** Extreu la lògica de negoci fora dels components visuals. Si un component fa més que "pintar", mou la lògica a un hook a `src/hooks`.
- **Typing:** Defineix tipus estrictes de TypeScript per a totes les props i respostes de l'API.

## 4. Rendiment (Battery & CPU)
- **GPS:** No demanis el GPS més del necessari. Usa la telemetria intel·ligent descrita a l'arquitectura.
- **AR:** El mode AR consumeix molta bateria. Implementa un `timeout` si l'usuari no es mou o tanca la càmera automàticament.

## 5. Ecosistema Expo
- **Instal·lació de Paquets:** Utilitza SEMPRE `npx expo install [package-name]`. Això garanteix que la versió del paquet sigui compatible amb la versió d'SDK d'Expo actual.
- **Expo Go vs Development Builds:** El projecte utilitza mòduls natius personalitzats (MMKV, Reanimated, Nitro). Per tant, **NO es pot utilitzar Expo Go**. S'ha d'utilitzar una **Development Build** instal·lada al dispositiu/emulador via `npx expo run:android` o `npx expo run:ios`.
- **EAS Build:** Les compilacions per a test o producció es gestionen a través d'Expo Application Services (EAS).

## 7. Gestió de Permisos (GPS)
Utilitza sempre el hook centralitzat `useLocationPermission`. 

### Per què?
- **Abstracció:** El hook gestiona l'estat de la sol·licitud (`loading`, `granted`, `denied`) de manera reactiva.
- **Fallbacks:** Permet oferir botons de "Recenter" només si el permís està actiu.

## 8. Rendiment del Mapa i Memoització
El component del mapa és altament sensible a les re-renderitzacions.

### Consells:
- **`React.memo`:** Envolta els markers (POIs) en `React.memo` per evitar que es tornin a pintar quan canvies de regió si les seves dades no han canviat.
- **`useCallback`:** Memoïza les funcions `onPress` o `onRegionChange` per evitar passar noves referències en cada render.
- **SurfaceView:** Recorda activar `surfaceView={true}` per a un rendiment òptim en Android.
## 6. Experiència Premium (UX)
- **Haptics:** Utilitza `expo-haptics` per donar feedback tàctil en accions importants (clics en botons principals, errors o successos). Això augmenta la sensació de qualitat de l'app.
- **Micro-animacions:** Usa `react-native-reanimated` per a transicions suaus entre estats.
