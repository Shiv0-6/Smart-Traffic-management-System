# Experiment 5 - Sequence Diagram (SE Lab)

## Theory
Sequence diagrams model time-ordered interactions between actors and system modules.
They show lifelines and messages in chronological order to capture runtime behavior.
They are useful for validating message flow, decision points, and real-time behaviors.

## Scenario 1: Adaptive Traffic Signal Control During Congestion

```mermaid
sequenceDiagram
    participant Camera as Traffic Camera
    participant Detector as Vehicle Detector
    participant Engine as Traffic Analysis Engine
    participant Signal as Signal Controller
    participant Dashboard as Admin Dashboard

    Camera->>Detector: Stream live intersection video
    Detector->>Engine: Send vehicle count and lane occupancy
    Engine->>Engine: Calculate congestion level
    alt Congestion detected
        Engine->>Signal: Increase green time for busy lane
        Signal-->>Engine: Signal timing updated
        Engine->>Dashboard: Push congestion + timing update
    else No congestion
        Engine->>Signal: Keep current cycle timings
        Signal-->>Engine: Timing unchanged
    end
    Dashboard-->>Dashboard: Render real-time status
```

## Scenario 2: Red-Light Violation Detection and Alert Workflow

```mermaid
sequenceDiagram
    participant Camera as Intersection Camera
    participant Detector as Violation Detector
    participant Service as Violation Service
    participant DB as Database
    participant Alert as Alert/Notification System
    participant Admin as Traffic Admin

    Camera->>Detector: Capture frame at stop line
    Detector->>Detector: Check signal state and vehicle position
    alt Red-light violation found
        Detector->>Service: Send violation evidence and metadata
        Service->>DB: Store violation record
        DB-->>Service: Record ID returned
        Service->>Alert: Trigger violation alert
        Alert-->>Admin: Notify with snapshot and details
    else No violation
        Detector-->>Service: No action required
    end
```

## Result
Two sequence-diagram scenarios were prepared:
1. Adaptive traffic signal control during congestion
2. Red-light violation detection and alert workflow
