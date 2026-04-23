# Experiment 7 - Component Diagram (SE Lab)

## Theory
Component diagrams represent high-level software modules and the interfaces/dependencies between them.

## Component Diagram: Smart Traffic Management System

```mermaid
flowchart TB
    UI[Web UI / Dashboard]
    API[Application Layer]
    AUTH[Auth Component]
    ANALYTICS[Traffic Analytics Component]
    SIGNAL[Signal Control Component]
    VIOLATION[Violation Detection Component]
    DB[(Supabase/PostgreSQL)]
    MAPS[Google Maps API]
    SOCKET[Realtime/WebSocket Layer]

    UI --> API
    API --> AUTH
    API --> ANALYTICS
    API --> SIGNAL
    API --> VIOLATION
    ANALYTICS --> DB
    SIGNAL --> DB
    VIOLATION --> DB
    UI --> MAPS
    API --> SOCKET
    SOCKET --> UI
```

## Result
A component diagram was prepared showing major modules and integration points of the system.
