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

## 3. Persistència (Storage)
**Eina:** [MMKV](https://github.com/mrousavy/react-native-mmkv)

Utilitzem MMKV per a dades que han de sobreviure al reinici de l'app (tokens, sessió d'usuari, preferències). 

### Per què MMKV?
- **Rendiment:** Fins a 30 vegades més ràpid que `AsyncStorage`.
- **Síncron:** Lectura instantània, evitant parpellejos de la UI (Flash of Unauthenticated Content) durant l'arrencada de l'app.
- **Seguretat:** Suporta xifrat natiu si és necessari.

### Integració amb Zustand
La persistència es configura directamente a la definició de l'Store (`persist` middleware). Això permet que Zustand s'encarregui de la lògica d'estat (tipus "Pinia") i MMKV actuï com el "motor" d'emmagatzematge físic (tipus "LocalStorage").

**Exemple d'integració:**
```typescript
export const useAuthStore = create<AuthState>()(
  persist(createAuthStore, {
    name: 'auth-storage',
    storage: createJSONStorage(() => mmkvStorage), // Motor MMKV
  })
);
```

> [!CAUTION]
> **Important:** MMKV utilitza mòduls natius en C++. Per aquest motiu, l'app no pot executar-se amb **Expo Go** i s'ha d'utilizar sempre una **Development Build** (`npx expo run:android`).
