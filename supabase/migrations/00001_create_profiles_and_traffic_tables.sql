/*
# Smart Traffic Management System - Database Schema

## 1. New Tables

### profiles
User profile table with role-based access control
- `id` (uuid, primary key, references auth.users)
- `email` (text, unique)
- `username` (text, unique)
- `role` (user_role enum: 'user', 'admin', 'operator')
- `created_at` (timestamptz, default: now())

### vehicle_detections
Stores vehicle detection data from YOLO
- `id` (uuid, primary key)
- `location` (text, not null) - intersection or road segment name
- `vehicle_type` (text, not null) - car, bus, motorcycle, truck, etc.
- `count` (integer, not null) - number of vehicles detected
- `confidence` (numeric) - detection confidence score
- `timestamp` (timestamptz, default: now())
- `video_source` (text) - source of the video feed
- `created_by` (uuid, references profiles)

### traffic_signals
Traffic signal control and status
- `id` (uuid, primary key)
- `location` (text, not null, unique) - intersection name
- `status` (text, not null) - current signal state (red, yellow, green)
- `mode` (text, not null) - auto or manual
- `timing_config` (jsonb) - signal timing configuration
- `last_updated` (timestamptz, default: now())
- `updated_by` (uuid, references profiles)

### violations
Traffic violation records
- `id` (uuid, primary key)
- `location` (text, not null)
- `violation_type` (text, not null) - red_light, illegal_turn, speeding, etc.
- `timestamp` (timestamptz, not null)
- `snapshot_url` (text) - URL to violation snapshot image
- `vehicle_plate` (text) - license plate if detected
- `status` (text, default: 'pending') - pending, reviewed, resolved
- `reviewed_by` (uuid, references profiles)
- `notes` (text)
- `created_at` (timestamptz, default: now())

### traffic_flow
Traffic flow simulation data from SUMO
- `id` (uuid, primary key)
- `location` (text, not null)
- `avg_speed` (numeric) - average speed in km/h
- `vehicle_count` (integer) - total vehicles
- `congestion_level` (text) - low, medium, high
- `timestamp` (timestamptz, default: now())
- `simulation_data` (jsonb) - detailed simulation data

## 2. Security

- Enable RLS on all tables
- Create admin/operator helper function
- Admins and operators have full access to all data
- Regular users can only view data (read-only access)
- Only authenticated users can access the system

## 3. Notes

- First registered user becomes admin automatically
- Operators have same permissions as admins for traffic management
- All timestamps use UTC timezone
*/

-- Create user role enum
CREATE TYPE user_role AS ENUM ('user', 'admin', 'operator');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE,
  username text UNIQUE,
  role user_role DEFAULT 'user'::user_role NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create vehicle_detections table
CREATE TABLE IF NOT EXISTS vehicle_detections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location text NOT NULL,
  vehicle_type text NOT NULL,
  count integer NOT NULL DEFAULT 0,
  confidence numeric,
  timestamp timestamptz DEFAULT now(),
  video_source text,
  created_by uuid REFERENCES profiles(id)
);

-- Create traffic_signals table
CREATE TABLE IF NOT EXISTS traffic_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'red',
  mode text NOT NULL DEFAULT 'auto',
  timing_config jsonb,
  last_updated timestamptz DEFAULT now(),
  updated_by uuid REFERENCES profiles(id)
);

-- Create violations table
CREATE TABLE IF NOT EXISTS violations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location text NOT NULL,
  violation_type text NOT NULL,
  timestamp timestamptz NOT NULL,
  snapshot_url text,
  vehicle_plate text,
  status text DEFAULT 'pending',
  reviewed_by uuid REFERENCES profiles(id),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create traffic_flow table
CREATE TABLE IF NOT EXISTS traffic_flow (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location text NOT NULL,
  avg_speed numeric,
  vehicle_count integer,
  congestion_level text,
  timestamp timestamptz DEFAULT now(),
  simulation_data jsonb
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE traffic_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE traffic_flow ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin or operator
CREATE OR REPLACE FUNCTION is_admin_or_operator(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role IN ('admin'::user_role, 'operator'::user_role)
  );
$$;

-- Profiles policies
CREATE POLICY "Admins and operators have full access to profiles" ON profiles
  FOR ALL TO authenticated USING (is_admin_or_operator(auth.uid()));

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile without changing role" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) 
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid()));

-- Vehicle detections policies
CREATE POLICY "Admins and operators can manage vehicle detections" ON vehicle_detections
  FOR ALL TO authenticated USING (is_admin_or_operator(auth.uid()));

CREATE POLICY "Users can view vehicle detections" ON vehicle_detections
  FOR SELECT TO authenticated USING (true);

-- Traffic signals policies
CREATE POLICY "Admins and operators can manage traffic signals" ON traffic_signals
  FOR ALL TO authenticated USING (is_admin_or_operator(auth.uid()));

CREATE POLICY "Users can view traffic signals" ON traffic_signals
  FOR SELECT TO authenticated USING (true);

-- Violations policies
CREATE POLICY "Admins and operators can manage violations" ON violations
  FOR ALL TO authenticated USING (is_admin_or_operator(auth.uid()));

CREATE POLICY "Users can view violations" ON violations
  FOR SELECT TO authenticated USING (true);

-- Traffic flow policies
CREATE POLICY "Admins and operators can manage traffic flow" ON traffic_flow
  FOR ALL TO authenticated USING (is_admin_or_operator(auth.uid()));

CREATE POLICY "Users can view traffic flow" ON traffic_flow
  FOR SELECT TO authenticated USING (true);

-- Trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
BEGIN
  IF OLD IS DISTINCT FROM NULL AND OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL THEN
    SELECT COUNT(*) INTO user_count FROM profiles;
    INSERT INTO profiles (id, email, username, role)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
      CASE WHEN user_count = 0 THEN 'admin'::user_role ELSE 'user'::user_role END
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Insert sample traffic signals for demonstration
INSERT INTO traffic_signals (location, status, mode, timing_config) VALUES
  ('Main St & 1st Ave', 'green', 'auto', '{"red": 45, "yellow": 5, "green": 50}'::jsonb),
  ('Main St & 2nd Ave', 'red', 'auto', '{"red": 50, "yellow": 5, "green": 45}'::jsonb),
  ('Oak St & 1st Ave', 'yellow', 'auto', '{"red": 40, "yellow": 5, "green": 55}'::jsonb),
  ('Oak St & 2nd Ave', 'green', 'manual', '{"red": 45, "yellow": 5, "green": 50}'::jsonb)
ON CONFLICT (location) DO NOTHING;