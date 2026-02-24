# 🛠️ Circuit Copilot: Guia de Configuració per a Desenvolupadors

Aquesta guia descriu la configuració de l'entorn de desenvolupament local per al monorepo de **Circuit Copilot**.

> [!IMPORTANT]
> Aquest projecte està dissenyat per funcionar de manera òptima en **Linux** o **macOS**. Per a Windows, es recomana l'ús de **WSL2**.

## 📋 Prerequisits

Abans de clonar el repositori, assegura't de tenir instal·lat el següent:

1. **Node.js (LTS)**: v18.0.0 o superior.
2. **Docker Desktop**: En funcionament i actualitzat (necessari per a PostGIS i Redis).
3. **Entorn de Desenvolupament Mòbil**:
   - **iOS**: Xcode (només Mac).
   - **Android**: Android Studio + SDK Platform Tools.
4. **Mapes**: Utilitzem MapLibre (Open Source), pel que no cal un token obligatori per al desenvolupament inicial.

## 🏗️ Estructura del Repositori

Utilitzem **Turborepo**. No cal executar `npm install` a cada carpeta individual.

```text
/
├── apps/
│   ├── mobile/         # Aplicació Expo (React Native)
│   └── server/         # Directori de microserveis
│       ├── gateway/    # API Gateway (Punt d'entrada)
│       ├── auth/       # Servei d'Antenticació
│       ├── geo/        # Servei de Mapes i Geo
│       └── social/     # Servei de Grups i Ubicació en viu
├── packages/
│   ├── types-schema/   # Tipus i esquemes compartits (@app/types-schema)
│   ├── core/           # Middleware i utilitats de backend (@app/core)
│   └── db/             # Esquema de Drizzle i Migracions (@app/db)
├── docs/               # Documentació tècnica i d'arquitectura
└── docker-compose.yml  # Orquestra tota la infraestructura amb Docker
```

## 🚀 Guia Ràpida

Segueix aquests 5 passos per posar-ho tot en marxa ràpidament:

### 1. Instal·lació de dependències 📦

Executa aquesta comanda a l'arrel del projecte:

```bash
npm install
```

### 2. Configuració de l'entorn (.env) 🤫

Cada servei té el seu propi arxiu de configuració. Vés a `apps/server/gateway`, `apps/server/auth-service`, etc.:

1. Còpia l'arxiu `.env.example` i anomena'l `.env.development`.
2. Edita l'arxiu amb les credencials corresponents.

### 3. Arrancar el sistema 🏎️

Des de l'arrel del projecte, pots arrancar tots els serveis (API + Bundler de Mobile):

```bash
npm run dev
```

O via Docker (recomanat per a base de dades):

```bash
docker compose up --build
```

### 4. Compilar i Executar al Mòbil 📱

> [!CAUTION]
> **Aquest projecte NO és compatible amb l'app estàndard "Expo Go"** a causa de l'ús de mòduls natius personalitzats (MMKV, Nitro).

Has de crear una **Development Build** i instal·lar-la al teu dispositiu o emulador:

**Per a Android:**

```bash
npm run android -w mobile
```

**Per a iOS:**

```bash
npm run ios -w mobile
```

> [!TIP]
> El flag `-w` és una abreviació de `--workspace`. Permet executar comandes d'un paquet específic des de l'arrel del projecte.

Un cop la "Development Build" estigui instal·lada al teu mòbil, ja no caldrà tornar a executar aquesta comanda tret que afegeixis nous paquets amb codi natiu. Per al desenvolupament diari, només caldrà tenir el Metro Bundler obert (`npm run dev`).

### 5. Túnel per a Mobile (Zrok) 🪄

Si vols provar-ho en un mòbil real, obre una altra terminal i executa:

```bash
zrok share public http://localhost:3000
```

Còpia la URL que et doni (ex: `https://xxxx.zrok.io`) i posa-la a la configuració `.env` de la App de Mobile (`EXPO_PUBLIC_API_URL`).

### 6. Verificació ✅

Obre el navegador a: `http://localhost:3000/status` (Gateway). Si veus `"status": "gateway_ok"`, ja funciona correctament.

## 🗄️ Infraestructura (Docker)

El sistema necessita una base de dades PostGIS. Pots aixecar-la i aplicar migracions amb:

```bash
docker compose up db -d
npm run migrate # Aplica els canvis a l'esquema de la base de dades
npm run seed:pedralbes # Pobla la base de dades amb POIs pel test a l'Institut Pedralbes
npm run seed # Pobla els POIs del Circuit (opcional)
```

> [!NOTE]
> L'script de `seed` s'encarrega d'inserir els Punts d'Interès (POIs) del Circuit de Barcelona-Catalunya per poder provar el mapa i l'API `geo` correctament.

### Proves d'Autenticació QR 🎫
Per provar l'escaneig d'entrades a l'aplicació mòbil en el teu entorn local, pots generar entrades de prova amb els seus respectius codis QR directament a la terminal:
```bash
npm run generate:qrs -w @app/db
```
Això inserirà 2 entrades de prova a la base de dades local i mostrarà els codis QR per pantalla perquè els puguis capturar ràpidament amb la càmera del mòbil per associar el compte.

## 🌐 Topologia de Xarxa (Amb Túnel)

```mermaid
graph TD
    A["Mòbil (Development Build)"] -- "Internet" --> B["Zrok Cloud (HTTPS)"]
    B -- "Tunnel" --> C["Gateway (Port 3000)"]
    C -- "Routing" --> D["Microserveis (Auth, Geo, Social)"]
    D -- "Query" --> E["PostGIS (Docker)"]
```

## 💡 Troubleshooting (Resolució de Problemes)

### Error: EACCES: permission denied, open '/app/package.json'

Si estàs utilitzant **Linux amb SELinux actiu** (ex: Fedora, RHEL, CentOS) i veus aquest error en executar Docker:

1. Assegura't que els volums a `docker-compose.yml` tenen el flag `:z` (ex: `- .:/app:z`).
2. Si el problema persisteix, potser cal etiquetar manualment el directori: `chcon -Rt svirt_sandbox_file_t .` (utilitza amb precaució).
3. Alternativament, comprova si el teu usuari té els permisos correctes al directori amfitrió.

> [!TIP]
> Per a una explicació més detallada de l'estratègia de desenvolupament, consulta **[strategy/dev-strategy.md](../strategy/dev-strategy.md)**.
