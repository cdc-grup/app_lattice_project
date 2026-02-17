# Database Schema: Circuit Copilot
> **Project:** Accessibility + Real-Time
> **Context:** Route management, accessibility, and groups for circuit events.

## 1. Visual Diagram (ERD)

This diagram represents the main entities and relationships.

```mermaid
erDiagram
    %% RELATIONSHIPS
    USERS ||--o{ TICKETS : owns
    USERS ||--o{ GROUPS : creates_admin
    USERS ||--o{ GROUP_MEMBERS : "is a member of"
    GROUPS ||--o{ GROUP_MEMBERS : contains
    USERS ||--o{ SAVED_LOCATIONS : saves

    %% ENTITIES
    USERS {
        int id PK
        string email
        string password_hash
        string full_name
        enum mobility_mode "standard, wheelchair, reduced_mobility, visual_impairment, family_stroller"
        boolean avoid_stairs
        boolean avoid_crowds
        boolean avoid_slopes
    }

    TICKETS {
        int id PK
        int user_id FK
        string code
        string gate
        string zone_name
        string seat_row
        string seat_number
        geometry seat_location
    }

    POINTS_OF_INTEREST {
        int id PK
        string name
        string description
        enum type "restaurant, wc, grandstand, gate, medical, shop, parking, meetup_point"
        geometry location
        enum crowd_level "low, moderate, high, blocked"
        boolean is_wheelchair_accessible
    }

    PATH_SEGMENTS {
        int id PK
        geometry start_node
        geometry end_node
        enum surface "asphalt, grass, gravel, stairs, ramp"
        float slope_percentage
        boolean has_stairs
        enum crowd_level
    }

    GROUPS {
        int id PK
        string name
        string invite_code
        int created_by FK
        geometry meeting_point
    }

    GROUP_MEMBERS {
        int user_id PK, FK
        int group_id PK, FK
        timestamp joined_at
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
        string file_url
        string version
        float size_mb
    }
```