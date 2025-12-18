import { supabase } from './supabase';
import type { Profile, VehicleDetection, TrafficSignal, Violation, TrafficFlow } from '@/types/types';

const isMock = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_MOCK_MODE === '1';

const mock = {
  profiles(count = 3): Profile[] {
    return Array.from({ length: count }).map((_, i) => ({
      id: `user-${i + 1}`,
      email: `user${i + 1}@example.com`,
      username: `user${i + 1}`,
      role: i === 0 ? 'admin' : 'user',
      created_at: new Date(Date.now() - i * 86400000).toISOString(),
    }));
  },
  signals(count = 6): TrafficSignal[] {
    const locations = [
      'Main St & 1st Ave',
      'Main St & 2nd Ave',
      'Oak St & 1st Ave',
      'Oak St & 2nd Ave',
      'Pine St & 3rd Ave',
      'Elm St & 4th Ave',
    ];
    const statuses = ['red', 'yellow', 'green'] as const;
    return locations.slice(0, count).map((loc, i) => ({
      id: `signal-${i + 1}`,
      location: loc,
      status: statuses[i % statuses.length],
      mode: i % 3 === 0 ? 'auto' : 'manual',
      timing_config: { red: 30, yellow: 5, green: 25 },
      last_updated: new Date().toISOString(),
      updated_by: 'system',
    }));
  },
  violations(count = 5): Violation[] {
    const types = ['red_light', 'wrong_way'];
    return Array.from({ length: count }).map((_, i) => ({
      id: `vio-${i + 1}`,
      location: i % 2 === 0 ? 'Main St & 1st Ave' : 'Oak St & 2nd Ave',
      violation_type: types[i % types.length],
      timestamp: new Date(Date.now() - i * 600000).toISOString(),
      snapshot_url: null,
      vehicle_plate: `DL ${1000 + i}`,
      status: i % 3 === 0 ? 'resolved' : 'pending',
      reviewed_by: null,
      notes: null,
      created_at: new Date().toISOString(),
    }));
  },
  flow(count = 12): TrafficFlow[] {
    const locations = [
      'Main St & 1st Ave',
      'Main St & 2nd Ave',
      'Oak St & 1st Ave',
      'Oak St & 2nd Ave',
    ];
    const levels = ['low', 'medium', 'high'] as const;
    return Array.from({ length: count }).map((_, i) => ({
      id: `flow-${i + 1}`,
      location: locations[i % locations.length],
      avg_speed: 20 + ((i * 7) % 40),
      vehicle_count: 10 + ((i * 13) % 120),
      congestion_level: levels[i % levels.length],
      timestamp: new Date(Date.now() - i * 300000).toISOString(),
      simulation_data: null,
    }));
  },
  detectionsStats() {
    return [
      { vehicle_type: 'car', count: 120 },
      { vehicle_type: 'bus', count: 12 },
      { vehicle_type: 'truck', count: 18 },
      { vehicle_type: 'bike', count: 55 },
    ];
  },
};

export const profilesApi = {
  async getAll() {
    if (isMock) return mock.profiles();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getById(id: string) {
    if (isMock) return mock.profiles(1)[0];
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async updateRole(id: string, role: string) {
    if (isMock) return { ...mock.profiles(1)[0], id, role } as Profile;
    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  }
};

export const vehicleDetectionsApi = {
  async getAll(limit = 100) {
    if (isMock) return mock.flow(limit).map((f, i) => ({
      id: `det-${i + 1}`,
      location: f.location,
      vehicle_type: ['car', 'bus', 'truck', 'bike'][i % 4],
      count: Math.floor((f.vehicle_count || 0) / 4),
      confidence: 0.95,
      timestamp: f.timestamp,
      video_source: null,
      created_by: 'system',
    }));
    const { data, error } = await supabase
      .from('vehicle_detections')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getByLocation(location: string) {
    if (isMock) return this.getAll(50);
    const { data, error } = await supabase
      .from('vehicle_detections')
      .select('*')
      .eq('location', location)
      .order('timestamp', { ascending: false })
      .limit(50);
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async create(detection: Omit<VehicleDetection, 'id' | 'timestamp'>) {
    if (isMock) return { id: 'det-new', timestamp: new Date().toISOString(), ...detection } as VehicleDetection;
    const { data, error } = await supabase
      .from('vehicle_detections')
      .insert(detection)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async getStats() {
    if (isMock) return mock.detectionsStats();
    const { data, error } = await supabase
      .from('vehicle_detections')
      .select('vehicle_type, count')
      .order('timestamp', { ascending: false })
      .limit(100);
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  }
};

export const trafficSignalsApi = {
  async getAll() {
    if (isMock) return mock.signals();
    const { data, error } = await supabase
      .from('traffic_signals')
      .select('*')
      .order('location', { ascending: true });
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getById(id: string) {
    if (isMock) return mock.signals(1)[0];
    const { data, error } = await supabase
      .from('traffic_signals')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: string, updatedBy: string) {
    if (isMock) return { ...mock.signals(1)[0], id, status } as TrafficSignal;
    const { data, error } = await supabase
      .from('traffic_signals')
      .update({ 
        status, 
        last_updated: new Date().toISOString(),
        updated_by: updatedBy 
      })
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async updateMode(id: string, mode: string, updatedBy: string) {
    if (isMock) return { ...mock.signals(1)[0], id, mode } as TrafficSignal;
    const { data, error } = await supabase
      .from('traffic_signals')
      .update({ 
        mode, 
        last_updated: new Date().toISOString(),
        updated_by: updatedBy 
      })
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async updateTiming(id: string, timingConfig: Record<string, number>, updatedBy: string) {
    if (isMock) return { ...mock.signals(1)[0], id, timing_config: timingConfig } as TrafficSignal;
    const { data, error } = await supabase
      .from('traffic_signals')
      .update({ 
        timing_config: timingConfig,
        last_updated: new Date().toISOString(),
        updated_by: updatedBy 
      })
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  }
};

export const violationsApi = {
  async getAll(limit = 100) {
    if (isMock) return mock.violations(limit);
    const { data, error } = await supabase
      .from('violations')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getById(id: string) {
    if (isMock) return mock.violations(1)[0];
    const { data, error } = await supabase
      .from('violations')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async create(violation: Omit<Violation, 'id' | 'created_at'>) {
    if (isMock) return { id: 'vio-new', created_at: new Date().toISOString(), ...violation } as Violation;
    const { data, error } = await supabase
      .from('violations')
      .insert(violation)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: string, reviewedBy: string, notes?: string) {
    if (isMock) return { ...mock.violations(1)[0], id, status, reviewed_by: reviewedBy, notes: notes || null } as Violation;
    const { data, error } = await supabase
      .from('violations')
      .update({ 
        status, 
        reviewed_by: reviewedBy,
        notes: notes || null
      })
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async getPending() {
    if (isMock) return mock.violations(4).filter(v => v.status === 'pending');
    const { data, error } = await supabase
      .from('violations')
      .select('*')
      .eq('status', 'pending')
      .order('timestamp', { ascending: false })
      .limit(50);
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  }
};

export const trafficFlowApi = {
  async getAll(limit = 100) {
    if (isMock) return mock.flow(limit);
    const { data, error } = await supabase
      .from('traffic_flow')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getByLocation(location: string, limit = 50) {
    if (isMock) return mock.flow(limit).filter(f => f.location === location);
    const { data, error } = await supabase
      .from('traffic_flow')
      .select('*')
      .eq('location', location)
      .order('timestamp', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async create(flow: Omit<TrafficFlow, 'id' | 'timestamp'>) {
    if (isMock) return { id: 'flow-new', timestamp: new Date().toISOString(), ...flow } as TrafficFlow;
    const { data, error } = await supabase
      .from('traffic_flow')
      .insert(flow)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async getLatestByLocation(location: string) {
    if (isMock) return mock.flow(1)[0];
    const { data, error } = await supabase
      .from('traffic_flow')
      .select('*')
      .eq('location', location)
      .order('timestamp', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  }
};
