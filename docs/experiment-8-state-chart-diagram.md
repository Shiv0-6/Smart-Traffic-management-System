# Experiment 8 - State Chart Diagram (SE Lab)

## Theory
State chart diagrams model the lifecycle of an entity by defining states, transitions, and triggering events.

## State Chart: Traffic Signal Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Green: trafficDetected
    Green --> Yellow: greenTimerExpired
    Yellow --> Red: yellowTimerExpired
    Red --> Green: nextCycleStart
    Green --> ExtendedGreen: congestionDetected
    ExtendedGreen --> Yellow: extensionTimeout
    Red --> EmergencyOverride: emergencyVehicleDetected
    EmergencyOverride --> Green: overrideReleased
    Red --> Maintenance: manualMaintenanceMode
    Maintenance --> Idle: maintenanceComplete
```

## Result
A state chart diagram was created for the traffic signal control state transitions.
