# Estratègia Offline (Offline First)

Donada la saturació de xarxa típica als circuits, l'aplicació ha de ser funcional sense internet constant.

## 1. Persistència de Dades (Caching)

- **API Data:** React Query persisteix les consultes crítiques a `MMKV`.
- **POIs:** Els Punts d'Interès s'emmagatzemen en una base de dades **SQLite** local (via Expo SQLite) per permetre cerques ràpides sense xarxa.

## 2. Mapes i Navegació Offline

- **Mapbox Offline:** Durant l'onboarding, es descarreguen els "Offline Packs" de la regió del circuit.
- **Routing Local:** El graf de navegació es troba en local. El servidor només envia pesos de congestió si hi ha xarxa.

## 3. Detecció de Connectivitat

L'app utilitza `@react-native-community/netinfo` per mostrar un bàner informatiu quan es perd la connexió i canviar la lògica d'enrutament a "Mode Local".

## 4. Telemetria Diferida

Si el servidor no està disponible, les actualitzacions d'ubicació de l'usuari s'emmagatzemen en una cua i s'envien quan es recupera la connexió (Sync Background).
