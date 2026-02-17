# Microserveis en Docker: Circuit Copilot

Aquest document detalla els microserveis integrats en l'entorn Docker i aquells que es recomana afegir per garantir el rendiment del sistema en entorns d'alta densitat.

## 1. Microserveis Actuals a Docker

### `api` (Backend - Node.js/Express)
- **Tecnologia:** Node.js, Express, Socket.io (amb MessagePack).
- **Funció:** Gestiona la lògica de negoci, l'autenticació JWT, la sincronització d'entrades i la telemetria en temps real.
- **Docker:** Build multi-etapa definit al `Dockerfile` de l'aplicació.

### `db` (Base de Dades - PostgreSQL)
- **Tecnologia:** PostgreSQL 15 amb l'extensió **PostGIS**.
- **Funció:** Emmagatzematge persistent de Punts d'Interès (POIs), dades d'usuaris i metadades geogràfiques.
- **Docker:** Imatge oficial de PostGIS.

## 2. Microserveis Recomanats (Gaps Detectats)

Per complir amb els requisits d'alta densitat (més de 100.000 persones) i baixa latència, es recomana la integració dels següents serveis:

### `cache` (Redis)
- **Funció:** Gestionar la telemetria de posició GPS de gran volum i l'estat de la cursa en viu sense sobrecarregar la base de dades principal.
- **Benefici:** Reducció dràstica de la latència en les actualitzacions de Socket.io.

### `db-admin` (Drizzle Studio / pgAdmin)
- **Funció:** Interfície gràfica per a la gestió de dades i visualització de la base de dades durant el desenvolupament.
- **Benefici:** Agilitat en la depuració de dades geogràfiques.

## 3. Serveis Fora de Docker

### `mobile` (Frontend - Expo/React Native)
- **Raó:** Segons l'arquitectura del projecte (`.context/00-core/architecture.md`), l'aplicació mòbil s'ha d'executar nativament per optimitzar la comunicació amb el Metro Bundler, acceleròmetres, GPS i sensors d'AR (ViroReact) en dispositius físics.
