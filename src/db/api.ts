import { supabase } from './supabase';
import type { Profile, VehicleDetection, TrafficSignal, Violation, TrafficFlow } from '@/types/types';

export const profilesApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async updateRole(id: string, role: string) {
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
    const { data, error } = await supabase
      .from('vehicle_detections')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getByLocation(location: string) {
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
    const { data, error } = await supabase
      .from('vehicle_detections')
      .insert(detection)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async getStats() {
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
    const { data, error } = await supabase
      .from('traffic_signals')
      .select('*')
      .order('location', { ascending: true });
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('traffic_signals')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: string, updatedBy: string) {
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
    const { data, error } = await supabase
      .from('violations')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('violations')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async create(violation: Omit<Violation, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('violations')
      .insert(violation)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: string, reviewedBy: string, notes?: string) {
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
    const { data, error } = await supabase
      .from('traffic_flow')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getByLocation(location: string, limit = 50) {
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
    const { data, error } = await supabase
      .from('traffic_flow')
      .insert(flow)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async getLatestByLocation(location: string) {
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
