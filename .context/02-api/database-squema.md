# Esquema de Base de Datos: Circuit
> **Proyecto:** Accessibilitat + Temps Real
> **Contexto:** Gestión de rutas, accesibilidad y grupos para eventos en circuito.

## 1. Diagrama Visual (ERD)

Este diagrama representa las relaciones y entidades principales.

```mermaid
erDiagram
    %% RELACIONES
    USERS ||--o{ TICKETS : posee
    USERS ||--o{ GROUPS : crea_admin
    USERS ||--o{ GROUP_MEMBERS : "es miembro de"
    GROUPS ||--o{ GROUP_MEMBERS : contiene
    USERS ||--o{ SAVED_LOCATIONS : guarda

    %% ENTIDADES
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