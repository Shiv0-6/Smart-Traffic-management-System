/*
# Enable Public Read Access

## Changes
This migration updates Row Level Security (RLS) policies to allow:
- **Public (unauthenticated) users**: Read-only access to all traffic data
- **Authenticated users**: Read-only access to all traffic data
- **Admin/Operator users**: Full read and write access to all traffic data

## Security Model
1. Anyone can view traffic data (vehicle detections, signals, violations, flow)
2. Only admins/operators can modify data
3. Profiles table remains restricted to authenticated users only

## Modified Policies
- vehicle_detections: Added public SELECT policy
- traffic_signals: Added public SELECT policy
- violations: Added public SELECT policy
- traffic_flow: Added public SELECT policy
- profiles: Kept authenticated-only access

## Notes
- This enables the system to be used as a public traffic information display
- Admin actions still require authentication
- First registered user becomes admin automatically
*/

-- Drop all existing policies and recreate with public access

-- Vehicle detections policies
DROP POLICY IF EXISTS "Admins and operators can manage vehicle detections" ON vehicle_detections;
DROP POLICY IF EXISTS "Users can view vehicle detections" ON vehicle_detections;
DROP POLICY IF EXISTS "Public can view vehicle detections" ON vehicle_detections;

CREATE POLICY "Public can view vehicle detections" ON vehicle_detections
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can manage vehicle detections" ON vehicle_detections
  FOR ALL TO authenticated USING (is_admin_or_operator(auth.uid()));

-- Traffic signals policies
DROP POLICY IF EXISTS "Admins and operators can manage traffic signals" ON traffic_signals;
DROP POLICY IF EXISTS "Users can view traffic signals" ON traffic_signals;
DROP POLICY IF EXISTS "Public can view traffic signals" ON traffic_signals;

CREATE POLICY "Public can view traffic signals" ON traffic_signals
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can manage traffic signals" ON traffic_signals
  FOR ALL TO authenticated USING (is_admin_or_operator(auth.uid()));

-- Violations policies
DROP POLICY IF EXISTS "Admins and operators can manage violations" ON violations;
DROP POLICY IF EXISTS "Users can view violations" ON violations;
DROP POLICY IF EXISTS "Public can view violations" ON violations;

CREATE POLICY "Public can view violations" ON violations
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can manage violations" ON violations
  FOR ALL TO authenticated USING (is_admin_or_operator(auth.uid()));

-- Traffic flow policies
DROP POLICY IF EXISTS "Admins and operators can manage traffic flow" ON traffic_flow;
DROP POLICY IF EXISTS "Users can view traffic flow" ON traffic_flow;
DROP POLICY IF EXISTS "Public can view traffic flow" ON traffic_flow;

CREATE POLICY "Public can view traffic flow" ON traffic_flow
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can manage traffic flow" ON traffic_flow
  FOR ALL TO authenticated USING (is_admin_or_operator(auth.uid()));

-- Profiles: Keep authenticated-only access (no changes needed)
-- Profiles remain restricted to authenticated users for privacy
