# 📱 Circuit Copilot

Benvingut al repositori oficial. Aquesta aplicació és una solució full-stack construïda amb **Express**, **Expo** i **PostgreSQL**, organitzada en un **monorepo** amb **Turborepo** i **Docker**.

> [!TIP]
> Aquest projecte utilitza **Turborepo** per gestionar el monorepo. Pots executar ordres des de l'arrel i s'aplicaran a tots els paquets de manera eficient.

## 🗺️ Mapa de Documentació

Per garantir un procés de desenvolupament fluid i una integració perfecta amb agents d'IA, mantenim una "Font de la Veritat" en els següents directoris:

### 🧠 Context del Projecte (Llest per a IA)

- **[System Prompt](.context/00-core/system-prompt.md)**: Pautes d'estil de codi, idioma i comportament de l'agent.
- **[Arquitectura](.context/00-core/architecture.md)**: Detalls de l'estructura tècnica i flux de dades.
- **[User Journeys](.context/01-product/user-journeys.md)**: Lògica de negoci i fluxos principals d'usuari.

### 🛠️ Especificacions i Guies

- **[Guia de Configuració](docs/SETUP_GUIDE.md)**: Com configurar l'entorn local amb Docker.
- **[Guia de Desplegament](docs/DEPLOYMENT.md)**: Com portar l'aplicació a producció.
- **[Guia del Col·laborador](docs/CONTRIBUTING.md)**: Regles per a branques, commits i Pull Requests.



## ⚡ Inici Ràpid

> [!IMPORTANT]
> Assegura't de tenir **Docker Desktop**/**Docker Compose** i **Node.js** (v18+) instal·lats abans de començar.

1.  **Instal·lar**: `npm install` a l'arrel.
2.  **Infraestructura**: `docker compose up -d` per aixecar PostgreSQL i PostGIS.
3.  **Desenvolupament**: `npm run dev` per iniciar tots els serveis (API + Mobile) simultàniament.



## 🛠️ Comandes Disponibles (Root)

Pots gestionar tot el projecte directament des de l'arrel del monorepo:

| Comanda | Descripció |
| :--- | :--- |
| `npm run dev` | Inicia el mode desenvolupament per a API i Mobile. |
| `npm run build` | Compila tots els paquets i aplicacions. |
| `npm run lint` | Executa el linter en tot el projecte. |
| `npm run test` | Executa les proves unitàries i d'integració. |
| `npm run format` | Formata el codi en tot el projecte amb Prettier. |

### 🗄️ Gestió de Base de Dades

> [!CAUTION]
> Utilitza `migrate` amb precaució en entorns de producció.

- `npm run generate`: Genera els fitxers de migració de Drizzle segons l'esquema.
- `npm run migrate`: Aplica les migracions pendents a la base de dades.
- `**npm** run studio`: Obre la interfície visual de Drizzle per explorar les dades.

## 🛠️ Estructura Tecnològica

- **Frontend:** React Native via Expo (@app/mobile).
- **Backend:** Node.js amb Express (@app/api).
- **Compartit:** Tipus **i** lògica comuna (@app/shared).
- **Infraestructura:** Postgres + PostGIS via Docker.
