# Gestió d'Estat (State Management)

Per a l'aplicació **Circuit Copilot**, utilitzem una estratègia híbrida de gestió d'estat per optimitzar el rendiment i la simplicitat.

## 1. Estat del Servidor (Server State)
**Eina:** [React Query (TanStack Query)](https://tanstack.com/query/latest)

S'utilitza per a totes les peticions a l'API (REST). Gestiona automàticament la memòria cau, els estats de càrrega (`isLoading`) i els re-intents.

- **Ubicació:** `src/hooks/queries`
- **Exemple:**
  ```tsx
  const { data: pois } = useQuery({
    queryKey: ['pois', category],
    queryFn: () => api.getPois(category),
  });
  ```

## 2. Estat Global de la UI (Global UI State)
**Eina:** [Zustand](https://github.com/pmndrs/zustand)

S'utilitza per a dades compartides que no provenen d'una API o que necessiten una actualització instantània a tota l'app.

- **Ubicació:** `src/store`
- **Casos d'ús:**
  - Preferències d'usuari (mode d'accessibilitat).
  - Estat del mode AR (actiu/inactiu).
  - Informació del tiquet sincronitzat.

## 3. Persistent Storage
**Eina:** `react-native-mmkv`

Per a dades que han de sobreviure al reinici de l'app (tokens, dades offline). És molt més ràpid que `AsyncStorage`.
