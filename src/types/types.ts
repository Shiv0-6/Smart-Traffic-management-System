export type UserRole = 'user' | 'admin' | 'operator';

export interface Profile {
  id: string;
  email: string | null;
  username: string | null;
  role: UserRole;
  created_at: string;
}

export interface VehicleDetection {
  id: string;
  location: string;
  vehicle_type: string;
  count: number;
  confidence: number | null;
  timestamp: string;
  video_source: string | null;
  created_by: string | null;
}

export interface TrafficSignal {
  id: string;
  location: string;
  status: string;
  mode: string;
  timing_config: {
    red: number;
    yellow: number;
    green: number;
  } | null;
  last_updated: string;
  updated_by: string | null;
}

export interface Violation {
  id: string;
  location: string;
  violation_type: string;
  timestamp: string;
  snapshot_url: string | null;
  vehicle_plate: string | null;
  status: string;
  reviewed_by: string | null;
  notes: string | null;
  created_at: string;
}

export interface TrafficFlow {
  id: string;
  location: string;
  avg_speed: number | null;
  vehicle_count: number | null;
  congestion_level: string | null;
  timestamp: string;
  simulation_data: Record<string, unknown> | null;
}

export interface DashboardStats {
  totalVehicles: number;
  activeSignals: number;
  pendingViolations: number;
  avgSpeed: number;
  congestionLevel: string;
}
