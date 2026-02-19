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
