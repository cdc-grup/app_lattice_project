# Contracte de l'API v1.0 - Lattice API

## 1. Estàndards Generals

- **Base URL:** `https://api.circuit-copilot.com/`
- **Autenticació:** Bearer Token (JWT) a les capçaleres. `Authorization: Bearer <token>`
- **Format de Dades:** JSON per a REST, MessagePack (binari) per a WebSockets (actualitzacions d'ubicació).
- **Format Geogràfic:** Totes les coordenades han de seguir l'estàndard **GeoJSON**: `[longitud, latitud]`.

## 2. Endpoints REST (HTTP)

### Autenticació i Onboarding (US1, US2)

#### `POST /auth/ticket-sync`

Enllaça una entrada física/digital amb l'usuari i n'extreu les metadades d'accés.

- **Cos (Body):**

```json
{
  "qr_code_data": "CADENA_CRÍPTICA_DEL_ESCÀNER",
  "device_id": "uuid-v4"
}
```

- **Resposta (200 OK):**

```json
{
  "user_id": "u-123",
  "token": "jwt_token_aquí",
  "ticket_info": {
    "gate": "Porta 3",
    "zone": "Tribuna G",
    "seat": "Fila 12, Seient 4",
    "seat_coordinates": [2.2645, 41.5701] // Objectiu per a la navegació
  }
}
```

#### `PATCH /users/me/parking` (US34)

Guarda la ubicació del cotxe per a la sortida.

- **Cos (Body):**

```json
{
  "location": [2.261, 41.569],
  "notes": "Pàrquing B, Fila 4"
}
```

### Navegació i Dades del Mapa (US6, US9)

#### `GET /pois`

Obté els Punts d'Interès (POI) estàtics. Es poden emmagatzemar a la memòria cau del dispositiu (SQLite local).

- **Paràmetres de consulta (Query Params):** `?category=restaurant,wc,grandstand`
- **Resposta (200 OK):**

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [2.26, 41.57] },
      "properties": {
        "id": 101,
        "name": "Burger Truck #4",
        "category": "restaurant",
        "description": "Premium food with short lines",
        "crowdLevel": "low"
      }
    }
  ]
}
```

#### `GET /pois/categories`

Obté la llista de categories disponibles per als POIs (per als chips de filtres).

- **Resposta (200 OK):**

```json
[
  { "id": "1", "label": "Gates", "icon": "door-open", "category": "gate" },
  { "id": "2", "label": "Food", "icon": "food", "category": "restaurant" }
]
```

### Encaminament Intel·ligent (utilitza US4, US7)

#### `POST /navigation/route`

Sol·licita una ruta per a vianants tenint en compte la congestió actual.

- **Cos (Body):**

```json
{
  "origin": [2.261, 41.568],
  "destination": [2.265, 41.572],
  "mode": "walking" // Futur: 'vip_shuttle'
}
```

- **Resposta (200 OK):**

```json
{
  "route_geometry": "cadena_polilínia_codificada", // Lleuger per a Mapbox
  "distance_meters": 450,
  "estimated_time_seconds": 380,
  "congestion_level": "alt", // La UI activa el color d'advertència
  "ar_checkpoints": [
    // Nodes on han d'aparèixer fletxes d'AR
    { "coords": [2.262, 41.569], "instruction": "Gira a l'esquerra a l'estand de Red Bull" }
  ]
}
```

## 3. Esdeveniments WebSocket (Temps Real)

**Protocol:** Socket.io
**Espai de noms (Namespace):** `/live-track`

### Emissions del Client (El que envia el mòbil)

#### `user:update_location` (Limitat)

Enviat com a màxim 1 vegada cada 30 segons o si s'ha mogut >20 m.

- **Càrrega útil (Payload):**

```json
{
  "lat": 41.5701,
  "lng": 2.2645,
  "accuracy": 12.5, // Metres. Ignora si és > 50m
  "heading": 180, // Per a l'orientació de l'AR
  "speed": 1.2 // m/s
}
```

#### `group:join`

Per unir-se a un grup d'amics.

- **Càrrega útil (Payload):** `{ "group_code": "FAST-CARS-24" }`

### 📥 Emissions del Servidor (El que rep el mòbil)

#### `group:locations`

Posicions dels amics al mapa.

- **Càrrega útil (Payload):**

```json
[
  { "user_id": "u-456", "name": "Marc", "coords": [2.26, 41.57], "last_seen": "fa 10s" },
  { "user_id": "u-789", "name": "Laia", "coords": [2.27, 41.58], "last_seen": "fa 2min" } // La UI mostra una icona de 'fora de línia'
]
```

#### `race:status` (US11)

Dades de la cursa en viu (Baixa Latència).

- **Càrrega útil (Payload):**

```json
{
  "lap": 45,
  "total_laps": 66,
  "flag": "yellow", // Activa una alerta a la UI
  "leaderboard_top3": ["VER", "HAM", "NOR"]
}
```

## 4. Estàndards de Gestió d'Errors

Totes les respostes d'error han de seguir aquest format perquè el Frontend pugui mostrar missatges consistents:

```json
{
  "error": {
    "code": "TICKET_INVALID",
    "message": "The QR code implies a generic entry, please select zone manually.",
    "user_friendly_message": "No hem pogut detectar la teva zona. Selecciona-la manualment.",
    "status": 400
  }
}
```
