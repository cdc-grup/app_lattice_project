# Esquema de Base de Dades: Circuit Copilot
> **Projecte:** Accessibilitat + Temps Real
> **Context:** Gestió de rutes, accessibilitat i grups per a esdeveniments al circuit.

## 1. Diagrama Visual (ERD)

Aquest diagrama representa les relacions i entitats principals.

```mermaid
erDiagram
    %% RELACIONS
    USERS ||--o{ TICKETS : posseeix
    USERS ||--o{ GROUPS : crea_admin
    USERS ||--o{ GROUP_MEMBERS : "és membre de"
    GROUPS ||--o{ GROUP_MEMBERS : conté
    USERS ||--o{ SAVED_LOCATIONS : guarda

    %% ENTITATS
    USERS {
        int id PK
        string email
        enum mobility_mode "Standard, Wheelchair, etc"
        boolean avoid_stairs
        boolean avoid_crowds
    }

    TICKETS {
        int id PK
        int user_id FK
        string code
        string gate
        geometry seat_location
    }

    POINTS_OF_INTEREST {
        int id PK
        string name
        enum type "Restaurant, WC, Gate..."
        enum crowd_level
        boolean is_wheelchair_accessible
    }

    PATH_SEGMENTS {
        int id PK
        geometry start_node
        geometry end_node
        enum surface "Asphalt, Grass..."
        float slope_percentage
        enum current_crowd_level
    }

    GROUPS {
        int id PK
        string invite_code
        int created_by FK
        geometry meeting_point
    }

    GROUP_MEMBERS {
        int user_id PK, FK
        int group_id PK, FK
        geometry last_location
        timestamp last_updated
    }

    SAVED_LOCATIONS {
        int id PK
        int user_id FK
        string label
        geometry location
    }

    OFFLINE_PACKAGES {
        int id PK
        string region_name
        float size_mb
    }
```