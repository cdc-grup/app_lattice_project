# Microserveis a Docker: Circuit Copilot

Aquest document detalla els microserveis integrats en l'entorn Docker.

## 1. Microserveis Actuals a Docker

### `gateway` (Api Gateway - Port 3000)
- **Tecnologia:** Node.js, Express.
- **Funció:** Punt d'entrada únic, encaminament de peticions als serveis interns.
- **Docker:** Build multi-etapa (apps/server/gateway/Dockerfile).

### `auth-service` (Autenticació - Port 3001)
- **Tecnologia:** Node.js, Fastify/Express, Drizzle ORM.
- **Funció:** Autenticació d'usuaris, emissió de JWT, gestió de perfils.
- **Docker:** Build multi-etapa (apps/server/auth-service/Dockerfile).

### `geo-service` (Lògica Geogràfica - Port 3002)
- **Tecnologia:** Node.js, PostGIS, Drizzle ORM.
- **Funció:** Gestió de POIs, navegació, rutes d'accessibilitat.
- **Docker:** Build multi-etapa (apps/server/geo-service/Dockerfile).

### `social-service` (Social i Temps Real - Port 3003)
- **Tecnologia:** Node.js, Socket.io.
- **Funció:** Seguiment de companys en temps real, gestió de grups.
- **Docker:** Build multi-etapa (apps/server/social-service/Dockerfile).

### `db` (Base de dades - Port 5432)
- **Tecnologia:** PostgreSQL 15 amb l'extensió **PostGIS**.
- **Funció:** Emmagatzematge persistent per a tots els serveis.
- **Docker:** Imatge oficial de PostGIS.

## 2. Microserveis Recomanats (Gaps Detectats)

Per complir amb els requisits d'alta densitat (més de 100.000 persones) i baixa latència, es recomana la integració dels següents serveis:

### `cache` (Redis)
- **Funció:** Gestionar el gran volum de telemetria de posicions GPS i estat de la cursa en viu sense sobrecarregar la base de dades principal.
- **Benefici:** Reducció dràstica de la latència en les actualitzacions de Socket.io.

### `db-admin` (Drizzle Studio / pgAdmin)
- **Funció:** Interfície gràfica per a la gestió de dades i visualització de la base de dades durant el desenvolupament.
- **Benefici:** Agilitat en la depuració de dades geogràfiques.

## 3. Serveis Fora de Docker

### `mobile` (Frontend - Expo/React Native)
- **Motiu:** Requereix accés al maquinari físic (GPS, Bluetooth, Càmera) i integració amb Metro Bundler per al desenvolupament. S'executa en dispositius Android/iOS o simuladors.
