# Experiment 6 - Collaboration Diagram (SE Lab)

## Theory
Collaboration diagrams show the relationships between objects and the numbered sequence of messages exchanged between them.
They focus on object interaction, message order, and responsibility sharing rather than detailed timing.
This makes them useful for understanding how a set of components cooperates to complete one workflow.

In a traffic management system, collaboration diagrams help trace how detection, analytics, signal control, storage, and notification objects exchange messages to complete one operation.
They are a compact way to document communication paths and identify which object is responsible for each step.

## Collaboration Diagram: Smart Traffic Management Workflow

```mermaid
flowchart LR
    A[1: Traffic Camera] -->|1.1 vehicleFrame()| B[2: Detection Engine]
    B -->|1.2 classifyAndTrack()| C[3: Traffic Analysis Service]
    C -->|1.3 congestionCheck()| D[4: Signal Controller]
    C -->|1.4 violationCheck()| E[5: Violation Service]
    D -->|1.5 updateSignalState()| F[6: Intersection Signal]
    E -->|1.6 saveViolation()| G[7: Database]
    E -->|1.7 sendAlert()| H[8: Notification Service]
    C -->|1.8 publishMetrics()| I[9: Admin Dashboard]
```

Note: Mermaid flowchart notation is used here as a simplified UML communication/collaboration view with numbered messages.

## Result
A collaboration diagram was created to show object interaction and message sequencing for the traffic workflow.
