# Traffic Management System - Open Source Upgrade

## Objective
Replace proprietary technologies with free, open-source alternatives and implement advanced traffic management algorithms.

## Implementation Plan

### Phase 1: Setup & Dependencies
- [x] Install Leaflet.js and React-Leaflet
- [x] Install Turf.js for geospatial calculations
- [x] Install Chart.js and React-ChartJS-2
- [x] Install Socket.io-client for real-time connectivity
- [x] Remove Google Maps dependencies (not needed, will replace usage)

### Phase 2: Global Map Component
- [x] Create LeafletMap component with OpenStreetMap
- [x] Configure CartoDB Dark Matter tiles
- [x] Add TomTom Traffic Flow overlay (with API key placeholder)
- [x] Integrate Turf.js for geospatial calculations
- [x] Add signal markers and vehicle markers

### Phase 3: Vehicle Detection Module
- [x] Implement DeepSORT tracking logic
- [x] Create unique ID assignment system
- [x] Implement vehicle classification (Heavy/Medium/Light)
- [x] Calculate Passenger Car Units (PCU)
- [x] Prevent double-counting with object ID tracking
- [x] Update VehicleDetection page

### Phase 4: Signal Control Module
- [x] Implement Webster's Method algorithm
- [x] Calculate adaptive cycle length
- [x] Implement queue-based green extension logic
- [x] Add real-time signal timing updates
- [x] Update SignalControl page

### Phase 5: Violations Module
- [x] Implement geofencing with stop line coordinates
- [x] Create Red Light Violation Detection (RLVD)
- [x] Implement Wrong Way Detection with Turf.bearing
- [x] Add violation alerts and logging
- [x] Update ViolationManagement page

### Phase 6: Traffic Simulation Module
- [ ] Parse OpenStreetMap data for road topology
- [ ] Create nodes and edges network
- [ ] Implement time-of-day density simulation
- [ ] Add morning peak vs. night logic
- [ ] Update TrafficSimulation page

### Phase 7: Data Analysis Module
- [x] Integrate Chart.js
- [x] Create Peak Hour Heatmap (Bar Chart)
- [x] Create Violation Types Pie Chart
- [x] Add interactive chart controls
- [x] Update DataAnalysis page

### Phase 8: Real-time Connectivity
- [x] Setup Socket.io-client
- [x] Listen for traffic_update events
- [x] Listen for violation_alert events
- [x] Update UI in real-time
- [x] Add connection status indicator

### Phase 9: Testing & Documentation
- [x] Test all modules
- [x] Verify algorithms
- [x] Update documentation
- [x] Create usage guide
- [x] Run lint checks

## Technical Stack

### Mapping
- **Leaflet.js**: Open-source map library
- **OpenStreetMap**: Free map tiles
- **CartoDB Dark Matter**: Dark theme tiles
- **TomTom Traffic Flow**: Traffic overlay (requires API key)

### Geospatial
- **Turf.js**: Advanced geospatial calculations
- **DeepSORT**: Object tracking algorithm

### Visualization
- **Chart.js**: Free charting library
- **React-ChartJS-2**: React wrapper

### Real-time
- **Socket.io-client**: WebSocket communication

## Algorithms

### Webster's Method
```
Cycle_Length = (1.5 * Loss_Time + 5) / (1 - Sum_of_Flow_Ratios)
```

### Queue Extension Logic
```
IF queue_length > 10 THEN
  green_time += 10 seconds
END IF
```

### Red Light Violation Detection
```
IF signal_state == RED AND vehicle_crosses_stop_line THEN
  trigger_violation_alert()
END IF
```

### Wrong Way Detection
```
bearing_diff = abs(vehicle_bearing - lane_bearing)
IF bearing_diff > 160 THEN
  trigger_wrong_way_alert()
END IF
```

## Notes
- All technologies must be free and open-source
- No Google Maps or proprietary APIs
- Focus on accuracy and real-time performance
- Maintain existing UI/UX design
