import React, { useEffect, useState } from 'react';
import { Car, Activity, AlertTriangle, Gauge, TrendingUp, Clock, Zap, Map as MapIcon, Wifi, RefreshCw, ArrowRight, ShieldCheck } from 'lucide-react';
import { StatCard } from '@/components/common/StatCard';
import { GoogleTrafficMap } from '@/components/common/GoogleTrafficMap';
import LeafletTrafficMap from '@/components/maps/LeafletTrafficMap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { trafficSignalsApi, violationsApi, trafficFlowApi, vehicleDetectionsApi } from '@/db/api';
import type { TrafficSignal, Violation, TrafficFlow } from '@/types/types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '@/hooks/useSocket';
import type { TrafficUpdate } from '@/utils/socketClient';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { connected: isConnected, trafficUpdates, violationAlerts } = useSocket();
  const [signals, setSignals] = useState<TrafficSignal[]>([]);
  const [violations, setViolations] = useState<Violation[]>([]);
  const [flowData, setFlowData] = useState<TrafficFlow[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeSignals: 0,
    pendingViolations: 0,
    avgSpeed: 0,
  });

  const isTrafficFlow = (data: TrafficUpdate['data']): data is TrafficFlow => {
    return 'vehicle_count' in data && 'avg_speed' in data && 'congestion_level' in data;
  };

  const isTrafficSignal = (data: TrafficUpdate['data']): data is TrafficSignal => {
    return 'status' in data && 'mode' in data && 'last_updated' in data;
  };

  const applyTrafficUpdate = (update: TrafficUpdate) => {
    if (update.type === 'flow_update' && isTrafficFlow(update.data)) {
      const flowUpdate = update.data;

      setFlowData((prev) => [flowUpdate, ...prev.filter((flow) => flow.id !== flowUpdate.id)].slice(0, 10));
      setStats((prev) => ({
        ...prev,
        totalVehicles: prev.totalVehicles + (flowUpdate.vehicle_count || 0),
        avgSpeed: flowUpdate.avg_speed ? Math.round(flowUpdate.avg_speed) : prev.avgSpeed,
      }));
    }

    if (update.type === 'signal_change' && isTrafficSignal(update.data)) {
      const signalUpdate = update.data;

      setSignals((prev) => {
        const exists = prev.some((signal) => signal.id === signalUpdate.id);

        if (!exists) {
          return [signalUpdate, ...prev];
        }

        return prev.map((signal) => (signal.id === signalUpdate.id ? signalUpdate : signal));
      });
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (trafficUpdates.length > 0) {
      const latestUpdate = trafficUpdates[trafficUpdates.length - 1];
      applyTrafficUpdate(latestUpdate);
    }
  }, [trafficUpdates]);

  useEffect(() => {
    if (violationAlerts.length > 0) {
      const latestAlert = violationAlerts[violationAlerts.length - 1];
      const liveViolation: Violation = {
        id: latestAlert.id,
        location: latestAlert.location,
        violation_type: latestAlert.type,
        timestamp: new Date(latestAlert.timestamp).toISOString(),
        snapshot_url: null,
        vehicle_plate: latestAlert.vehicleId,
        status: 'pending',
        reviewed_by: null,
        notes: `Realtime alert severity: ${latestAlert.severity}`,
        created_at: new Date().toISOString(),
      };

      setViolations((prev) => [liveViolation, ...prev.filter((violation) => violation.id !== liveViolation.id)].slice(0, 50));
      setStats((prev) => ({
        ...prev,
        pendingViolations: prev.pendingViolations + 1,
      }));
      toast.error(`New violation detected: ${latestAlert.type}`, {
        description: latestAlert.location,
      });
    }
  }, [violationAlerts]);

  const loadData = async () => {
    try {
      const [signalsData, violationsData, flowDataResult, detections] = await Promise.all([
        trafficSignalsApi.getAll(),
        violationsApi.getPending(),
        trafficFlowApi.getAll(10),
        vehicleDetectionsApi.getStats(),
      ]);

      setSignals(signalsData);
      setViolations(violationsData);
      setFlowData(flowDataResult);

      const totalVehicles = detections.reduce((sum, d) => sum + d.count, 0);
      const avgSpeed = flowDataResult.length > 0
        ? flowDataResult.reduce((sum, f) => sum + (f.avg_speed || 0), 0) / flowDataResult.length
        : 0;

      setStats({
        totalVehicles,
        activeSignals: signalsData.length,
        pendingViolations: violationsData.length,
        avgSpeed: Math.round(avgSpeed),
      });
    } catch (error: any) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'green':
        return 'traffic-light-green';
      case 'yellow':
        return 'traffic-light-yellow';
      case 'red':
        return 'traffic-light-red';
      default:
        return 'bg-muted';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary glow-primary"></div>
          <p className="text-muted-foreground">Loading traffic data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Traffic Management Dashboard</h1>
          <p className="text-muted-foreground mt-2 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Real-time overview of traffic system status
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 rounded-md border border-success/30 bg-success/10 px-3 py-2">
            <ShieldCheck className="h-4 w-4 text-success" />
            <span className="text-sm font-medium">System Online</span>
          </div>
          <div className={`flex items-center gap-2 rounded-md border px-3 py-2 ${
            isConnected 
              ? 'bg-green-500/10 border-green-500/30' 
              : 'bg-red-500/10 border-red-500/30'
          }`}>
            <Wifi className={`h-4 w-4 ${isConnected ? 'text-green-500' : 'text-red-500'}`} />
            <span className="text-sm font-medium">
              Socket.io {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <Button variant="outline" onClick={loadData} className="sm:ml-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div>
          <StatCard
            title="Total Vehicles"
            value={stats.totalVehicles}
            icon={Car}
            description="Detected in last hour"
            trend={{ value: 12, isPositive: true }}
          />
        </div>
        <div>
          <StatCard
            title="Active Signals"
            value={stats.activeSignals}
            icon={Activity}
            description="Traffic lights operational"
          />
        </div>
        <div>
          <StatCard
            title="Pending Violations"
            value={stats.pendingViolations}
            icon={AlertTriangle}
            description="Awaiting review"
          />
        </div>
        <div>
          <StatCard
            title="Avg Speed"
            value={`${stats.avgSpeed} km/h`}
            icon={Gauge}
            description="Across all locations"
            trend={{ value: 5, isPositive: false }}
          />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2 grid-cols-1">
        <Card className="surface-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MapIcon className="h-5 w-5 text-primary" />
                  Google Traffic Map
                </CardTitle>
                <CardDescription>Interactive real-time traffic visualization with Google Maps</CardDescription>
              </div>
              <Badge variant="outline" className="border-primary text-primary">
                LIVE
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="overflow-hidden rounded-lg border border-border" style={{ height: '500px' }}>
                <GoogleTrafficMap signals={signals} />
              </div>
              <div className="text-xs text-muted-foreground text-center">
                Google Maps with traffic layer and signal markers
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="surface-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MapIcon className="h-5 w-5 text-accent" />
                  Google Map (Standard)
                </CardTitle>
                <CardDescription>Standard Google Map without the traffic overlay</CardDescription>
              </div>
              <Badge variant="outline" className="border-accent text-accent shadow-sm">
                Standard
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="overflow-hidden rounded-lg border border-border" style={{ height: '500px' }}>
                <GoogleTrafficMap signals={signals} trafficLayer={false} mapStyles={null} />
              </div>
              <div className="text-xs text-muted-foreground text-center">
                Clean Google Map view without traffic layer
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3 grid-cols-1">
        <Card className="surface-card xl:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapIcon className="h-5 w-5 text-primary" />
                OpenStreetMap Traffic View
              </CardTitle>
              <Badge variant="outline" className="border-primary text-primary shadow-sm">
                Leaflet.js
              </Badge>
            </div>
            <CardDescription>
              Free, open-source mapping with CartoDB Dark Matter tiles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-lg border border-border">
              <LeafletTrafficMap signals={signals} />
            </div>
            <div className="text-xs text-muted-foreground text-center mt-3">
              Powered by OpenStreetMap and Leaflet.js
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6 col-span-1">
          <Card className="surface-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-accent" />
                Quick Actions
              </CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={() => navigate('/detection')}
              >
                <Car className="h-4 w-4 mr-2" />
                <span className="mr-auto">Vehicle Detection</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={() => navigate('/signals')}
              >
                <Activity className="h-4 w-4 mr-2" />
                <span className="mr-auto">Signal Control</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={() => navigate('/violations')}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                <span className="mr-auto">View Violations</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={() => navigate('/analysis')}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                <span className="mr-auto">Data Analysis</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="surface-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                System Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {violations.length > 0 ? (
                <>
                  <div className="interactive-row cursor-pointer p-3" onClick={() => navigate('/violations')}>
                    <p className="text-sm font-medium flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-destructive animate-pulse"></span>
                      {violations.length} Pending Violations
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Requires immediate attention</p>
                  </div>
                  {flowData.some(f => f.congestion_level === 'high') && (
                    <div className="interactive-row cursor-pointer p-3" onClick={() => navigate('/simulation')}>
                      <p className="text-sm font-medium flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-warning animate-pulse"></span>
                        High Congestion Detected
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {flowData.filter(f => f.congestion_level === 'high').length} locations affected
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-lg border border-success/20 bg-success/10 p-3">
                  <p className="text-sm font-medium">All Systems Normal</p>
                  <p className="text-xs text-muted-foreground mt-1">No alerts at this time</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2 grid-cols-1">
        <Card className="surface-card">
          <CardHeader>
            <CardTitle>Traffic Signals Status</CardTitle>
            <CardDescription>Current status of all traffic lights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {signals.slice(0, 4).map((signal) => (
                <div key={signal.id} className="interactive-row flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${getStatusColor(signal.status)} animate-pulse`} />
                    <div>
                      <p className="font-medium text-sm">{signal.location}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        {signal.mode === 'auto' && <Zap className="h-3 w-3" />}
                        Mode: {signal.mode}
                      </p>
                    </div>
                  </div>
                  <Badge variant={signal.status === 'green' ? 'default' : 'secondary'} className="font-mono">
                    {signal.status.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="surface-card">
          <CardHeader>
            <CardTitle>Recent Violations</CardTitle>
            <CardDescription>Latest traffic violations detected</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {violations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-4">
                    <Activity className="h-8 w-8 text-success" />
                  </div>
                  <p className="text-sm font-medium">No pending violations</p>
                  <p className="text-xs text-muted-foreground mt-1">System is running smoothly</p>
                </div>
              ) : (
                violations.slice(0, 4).map((violation) => (
                  <div key={violation.id} className="interactive-row flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium text-sm">{violation.location}</p>
                      <p className="text-xs text-muted-foreground capitalize mt-1">
                        {violation.violation_type.replace('_', ' ')}
                      </p>
                    </div>
                    <Badge variant="destructive">{violation.status}</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
