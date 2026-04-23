# Experiment 10 - Reverse Engineering in Java (Code to Model) and Deployment Diagram

## Theory
Reverse engineering derives UML models from existing source code to understand structure, dependencies, and runtime deployment.

## Java Code Sample (Input for Reverse Engineering)

```java
class SensorNode {
    String sensorId;
    String location;
}

class TrafficProcessor {
    void analyze(SensorNode node) {
        // traffic analytics logic
    }
}

class AlertService {
    void sendAlert(String message) {
        // notification logic
    }
}
```

## Reverse-Engineered Class Model (Code to UML)

```mermaid
classDiagram
    class SensorNode {
        +String sensorId
        +String location
    }

    class TrafficProcessor {
        +analyze(node: SensorNode) void
    }

    class AlertService {
        +sendAlert(message: String) void
    }

    TrafficProcessor --> SensorNode
    TrafficProcessor ..> AlertService : triggers alerts
```

## Deployment Diagram

```mermaid
flowchart LR
    subgraph Edge["Roadside Edge Layer"]
        CAM[Camera/Sensor Node]
        EDGE[Edge Compute Unit]
    end

    subgraph Cloud["Cloud/Application Layer"]
        APP[Traffic Management App Server]
        WS[Realtime Notification Service]
        DB[(Traffic Database)]
    end

    subgraph Client["Client Layer"]
        DASH[Admin Dashboard / Browser]
    end

    CAM --> EDGE
    EDGE --> APP
    APP --> DB
    APP --> WS
    WS --> DASH
    APP --> DASH
```

## Result
Reverse engineering was performed from Java code to UML class model, and a deployment diagram was created for runtime architecture.
