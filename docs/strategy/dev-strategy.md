# Estratègia de Desenvolupament: Gateway & Microserveis

Dins de l'arquitectura de microserveis, el desenvolupament es centra en el **Gateway** com a punt d'entrada i els serveis especialitzats per a cada funcionalitat.

## 1. Gateway Incremental (Encaminament)

El **Gateway** (`apps/server/gateway`) actua com a punt central.

- Les peticions s'encaminen als microserveis locals (`auth-service`, `geo-service`, etc.) segons el prefix de la ruta.
- Per a rutes encara no implementades o de producció, es pot configurar el proxy cap a `EXTERNAL_API_URL`.

### Configuració

S'utilitzen fitxers `.env` dins de cada microservei i del gateway:

- `.env.development`: Configuració local per al dia a dia.
- `.env.production`: Configuració de producció.

## 2. Túnel amb Zrok (Accés des de Mòbil)

Perquè els dispositivos físics (iOS/Android) puguin connectar-se al Gateway que corre al teu ordinador, s'utilitza **Zrok**.

### Flux de dades:

`Mòbil` -> `URL Zrok (HTTPS)` -> `Gateway (3000)` -> `Microservei (3001, 3002...)`

## 3. Comandes útils

- **Port del Gateway:** 3000
- **Compartir túnel:** `zrok share public http://localhost:3000`

Per més detalls, consulta el fitxer [zrok-guide.md](../guides/zrok-guide.md).
