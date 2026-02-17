# Contracte de l'API v1.0 - Circuit Copilot API

## 1. Estàndards Generals

- **URL Base:** `https://api.circuit-copilot.com/`
- **Autenticació:** Token de portador (Bearer Token - JWT) a les capçaleres. `Authorization: Bearer <token>`
- **Format de Dades:** JSON per a REST, MessagePack (binari) per a WebSockets (actualitzacions d'ubicació).
- **Format Geo:** Totes les coordenades han de seguir l'estàndard **GeoJSON**: `[longitud, latitud]`.

## 2. Punts finals REST (HTTP)

### Autenticació i Usuari (US1, US2, US5)

#### `POST /auth/ticket-sync`
Enllaça una entrada amb l'usuari.
- **Body:** `{ "qr_code_data": "string", "device_id": "uuid" }`
- **Resposta (200):** `{ "user_id": "u-123", "token": "jwt", "ticket_info": { ... } }`

#### `GET /users/me`
Obté el perfil i preferències de l'usuari.
- **Resposta (200):**
```json
{
  "id": "u-123",
  "email": "user@example.com",
  "preferences": {
    "mobility_mode": "wheelchair",
    "avoid_stairs": true,
    "avoid_crowds": false
  }
}
```

#### `PATCH /users/me`
Actualitza preferències de mobilitat o dades de l'usuari.
- **Body:** `{ "mobility_mode": "standard", "avoid_stairs": false }`

### Ubicacions i PDI (US6, US9, US34)

#### `GET /pois`
Punts d'interès estàtics.
- **Query:** `?category=toilet,food&changed_since=ISO8601`

#### `GET /locations`
Llista ubicacions guardades per l'usuari (Parking, Punts de trobada).
- **Resposta (200):** `[ { "id": 1, "label": "Cotxe", "location": [2.2, 41.5] } ]`

#### `POST /locations`
Guarda una nova ubicació personalitzada.
- **Body:** `{ "label": "Punt de trobada", "location": [2.26, 41.57] }`

#### `DELETE /locations/:id`
Elimina una ubicació guardada.

### Grups i Social (US15, US16)

#### `POST /groups`
Crea un grup i retorna el codi d'invitació.
- **Body:** `{ "meeting_point": [2.26, 41.57] }`
- **Resposta (201):** `{ "id": "g-555", "invite_code": "FAST-CARS" }`

#### `GET /groups/:id/members`
Llista membres i la seva última ubicació (GeoJSON).
- **Resposta (200):** `[ { "user_id": "u-456", "name": "Marc", "coords": [2.2, 41.5], "last_updated": "ISO8601" } ]`

#### `DELETE /groups/:id/leave`
Surt del grup actual.

### Navegació i Mapa (US4, US7, US33)

#### `POST /navigation/route`
Ruta optimitzada segons congestió i accessibilitat.
- **Body:** 
```json
{
  "origin": [2.261, 41.568],
  "destination": [2.265, 41.572],
  "accessibility": { "avoid_stairs": true } // Opcional, heretat de l'usuari si no es defineix
}
```
- **Resposta (200):** `{ "route_geometry": "poly...", "congestion_level": "low", "ar_checkpoints": [...] }`

#### `GET /map/offline-packages`
Metadades dels paquets descarregables.
- **Resposta (200):** `[ { "region": "Entire Circuit", "size_mb": 45.5, "url": "..." } ]`

#### `GET /events/schedule`
Horari oficial de l'esdeveniment.
- **Resposta (200):** `[ { "time": "14:00", "event": "F1 Race", "type": "main" } ]`

## 3. Esdeveniments de WebSocket (Temps Real)

**Namespace:** `/live-track`

### Client -> Servidor
- `user:update_location`: Envia `{ lat, lng, accuracy, heading, speed }`.
- `group:join`: Envia `{ group_code }`.

### Servidor -> Client
- `group:locations`: Llista actualitzada de posicions dels amics del grup.
- `race:status`: Dades de la cursa (volta, banderes, leaderboard).
- `map:congestion_update`: Alerta de nova zona congestionada que afecta la ruta actual.

## 4. Gestió d'Errors
Respostes estructurades amb `error.code`, `error.message` i `error.user_friendly_message` (localitzat).

