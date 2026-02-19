# Desplegament i CI/CD (Expo EAS)

Utilitzem **Expo Application Services (EAS)** per gestionar les builds i la distribució.

## 1. Builds
- **EAS Build:** Configurat al fitxer `eas.json`.
- **Profiles:**
  - `development`: Build per a simulador i dispositiu real amb perfil de debug.
  - `preview`: Build per a testejadors (internal distribution).
  - `production`: Build per a les App Stores.

## 2. Actualitzacions OTA (Over-the-Air)
**Eina:** `expo-updates`

Ens permet corregir bugs menors o actualitzar la UI sense que l'usuari hagi de baixar una nova versió de la Store. Crucial durant el cap de setmana de la cursa per a actualitzacions ràpides.

## 3. Distribució
- **iOS:** TestFlight.
- **Android:** Google Play Console (Internal Testing).
- **Zrok:** Per a proves ràpides en xarxa local des del mòbil.
