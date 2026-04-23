# Experiment 9 - Forward Engineering in Java (Model to Code)

## Theory
Forward engineering transforms UML models (classes, relationships, behavior) into source code.
It starts from a design model and produces implementation artifacts such as classes, methods, and interfaces.
This approach helps keep the code aligned with the intended architecture and reduces ambiguity during development.

In software engineering labs, forward engineering is commonly used to demonstrate how class diagrams can be converted into Java code with attributes, constructors, and operations.
It is especially useful when the objective is to preserve the structure of the model while moving from design to implementation.

## UML Class View Used for Conversion

```mermaid
classDiagram
    class TrafficSignal {
        -String id
        -String state
        -int greenTime
        +setState(String state) void
        +optimizeTiming(int density) void
    }

    class Violation {
        -String violationId
        -String type
        -String status
        +markReviewed() void
    }

    class TrafficController {
        +processTraffic(int density) void
        +reportViolation(Violation v) void
    }

    TrafficController --> TrafficSignal
    TrafficController ..> Violation
```

Note: In UML, `-->` denotes association and `..>` denotes dependency.
In this example, association maps to a held `TrafficSignal` reference, while dependency maps to
method-level `Violation` usage.

## Java Code (Model-to-Code Output)

```java
class TrafficSignal {
    private String id;
    private String state;
    private int greenTime;

    public TrafficSignal(String id, String state, int greenTime) {
        this.id = id;
        this.state = state;
        this.greenTime = greenTime;
    }

    public void setState(String state) {
        this.state = state;
    }

    public void optimizeTiming(int density) {
        if (density > 80) {
            greenTime += 10;
        } else if (density < 30) {
            greenTime = Math.max(20, greenTime - 5);
        }
    }
}

class Violation {
    private String violationId;
    private String type;
    private String status;

    public Violation(String violationId, String type, String status) {
        this.violationId = violationId;
        this.type = type;
        this.status = status;
    }

    public void markReviewed() {
        this.status = "REVIEWED";
    }
}

class TrafficController {
    private final TrafficSignal signal;

    public TrafficController(TrafficSignal signal) {
        this.signal = signal;
    }

    public void processTraffic(int density) {
        signal.optimizeTiming(density);
    }

    public void reportViolation(Violation v) {
        v.markReviewed();
    }
}
```

Note: Getter methods are intentionally omitted to keep the forward-engineering example concise.

## Result
Forward engineering was demonstrated by converting UML model structure into Java classes.
