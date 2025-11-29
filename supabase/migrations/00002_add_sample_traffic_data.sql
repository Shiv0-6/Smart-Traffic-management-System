/*
# Add Sample Traffic Data for System Demonstration

This migration adds sample data to demonstrate the traffic management system functionality.

## Data Added:
1. **Vehicle Detections**: Sample vehicle detection records across different locations
2. **Traffic Flow**: Real-time traffic flow data with congestion levels
3. **Violations**: Sample traffic violation records for demonstration

## Note:
This is demonstration data to show system functionality. In production, this data would come from:
- YOLO vehicle detection service
- SUMO traffic simulation engine
- Automated violation detection systems
*/

-- Insert sample vehicle detections
INSERT INTO vehicle_detections (location, vehicle_type, count, confidence, timestamp) VALUES
  ('Main St & 1st Ave', 'car', 45, 0.95, NOW() - INTERVAL '5 minutes'),
  ('Main St & 1st Ave', 'bus', 3, 0.92, NOW() - INTERVAL '5 minutes'),
  ('Main St & 1st Ave', 'motorcycle', 8, 0.88, NOW() - INTERVAL '5 minutes'),
  ('Main St & 2nd Ave', 'car', 52, 0.94, NOW() - INTERVAL '3 minutes'),
  ('Main St & 2nd Ave', 'truck', 5, 0.91, NOW() - INTERVAL '3 minutes'),
  ('Oak St & 1st Ave', 'car', 38, 0.96, NOW() - INTERVAL '2 minutes'),
  ('Oak St & 1st Ave', 'motorcycle', 12, 0.89, NOW() - INTERVAL '2 minutes'),
  ('Oak St & 2nd Ave', 'car', 41, 0.93, NOW() - INTERVAL '1 minute'),
  ('Oak St & 2nd Ave', 'bus', 2, 0.90, NOW() - INTERVAL '1 minute'),
  ('Main St & 1st Ave', 'car', 48, 0.94, NOW() - INTERVAL '15 minutes'),
  ('Main St & 1st Ave', 'truck', 4, 0.91, NOW() - INTERVAL '15 minutes'),
  ('Main St & 2nd Ave', 'car', 55, 0.95, NOW() - INTERVAL '12 minutes'),
  ('Main St & 2nd Ave', 'motorcycle', 9, 0.87, NOW() - INTERVAL '12 minutes'),
  ('Oak St & 1st Ave', 'car', 42, 0.94, NOW() - INTERVAL '10 minutes'),
  ('Oak St & 1st Ave', 'bus', 3, 0.92, NOW() - INTERVAL '10 minutes'),
  ('Oak St & 2nd Ave', 'car', 39, 0.93, NOW() - INTERVAL '8 minutes'),
  ('Oak St & 2nd Ave', 'truck', 6, 0.90, NOW() - INTERVAL '8 minutes');

-- Insert sample traffic flow data
INSERT INTO traffic_flow (location, vehicle_count, avg_speed, congestion_level, timestamp) VALUES
  ('Main St & 1st Ave', 56, 35, 'medium', NOW() - INTERVAL '2 minutes'),
  ('Main St & 2nd Ave', 66, 28, 'high', NOW() - INTERVAL '2 minutes'),
  ('Oak St & 1st Ave', 52, 42, 'low', NOW() - INTERVAL '2 minutes'),
  ('Oak St & 2nd Ave', 49, 38, 'low', NOW() - INTERVAL '2 minutes'),
  ('Main St & 1st Ave', 53, 38, 'medium', NOW() - INTERVAL '10 minutes'),
  ('Main St & 2nd Ave', 62, 30, 'high', NOW() - INTERVAL '10 minutes'),
  ('Oak St & 1st Ave', 48, 45, 'low', NOW() - INTERVAL '10 minutes'),
  ('Oak St & 2nd Ave', 51, 40, 'low', NOW() - INTERVAL '10 minutes'),
  ('Main St & 1st Ave', 58, 32, 'medium', NOW() - INTERVAL '20 minutes'),
  ('Main St & 2nd Ave', 70, 25, 'high', NOW() - INTERVAL '20 minutes'),
  ('Oak St & 1st Ave', 45, 48, 'low', NOW() - INTERVAL '20 minutes'),
  ('Oak St & 2nd Ave', 47, 42, 'low', NOW() - INTERVAL '20 minutes');

-- Insert sample violation records
INSERT INTO violations (location, violation_type, timestamp, vehicle_plate, snapshot_url, status) VALUES
  ('Main St & 1st Ave', 'red_light', NOW() - INTERVAL '30 minutes', 'ABC-1234', 'https://example.com/snapshot1.jpg', 'pending'),
  ('Main St & 2nd Ave', 'speeding', NOW() - INTERVAL '45 minutes', 'XYZ-5678', 'https://example.com/snapshot2.jpg', 'pending'),
  ('Oak St & 1st Ave', 'illegal_turn', NOW() - INTERVAL '1 hour', 'DEF-9012', 'https://example.com/snapshot3.jpg', 'reviewed'),
  ('Oak St & 2nd Ave', 'red_light', NOW() - INTERVAL '2 hours', 'GHI-3456', 'https://example.com/snapshot4.jpg', 'pending'),
  ('Main St & 1st Ave', 'illegal_parking', NOW() - INTERVAL '3 hours', 'JKL-7890', 'https://example.com/snapshot5.jpg', 'resolved'),
  ('Main St & 2nd Ave', 'red_light', NOW() - INTERVAL '4 hours', 'MNO-2345', 'https://example.com/snapshot6.jpg', 'reviewed'),
  ('Oak St & 1st Ave', 'speeding', NOW() - INTERVAL '5 hours', 'PQR-6789', 'https://example.com/snapshot7.jpg', 'pending'),
  ('Oak St & 2nd Ave', 'illegal_turn', NOW() - INTERVAL '6 hours', 'STU-0123', 'https://example.com/snapshot8.jpg', 'resolved');