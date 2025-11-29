import React, { useEffect, useState } from 'react';
import { Car, Activity, AlertTriangle, Gauge, TrendingUp, Clock, Zap, Map as MapIcon, Wifi } from 'lucide-react';
import { StatCard } from '@/components/common/StatCard';
import { TrafficMap } from '@/components/common/TrafficMap';
import LeafletTrafficMap from '@/components/maps/LeafletTrafficMap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { trafficSignalsApi, violationsApi, trafficFlowApi, vehicleDetectionsApi } from '@/db/api';
import type { TrafficSignal, Violation, TrafficFlow } from '@/types/types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '@/hooks/useSocket';

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

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (trafficUpdates.length > 0) {
      const latestUpdate = trafficUpdates[trafficUpdates.length - 1];
      console.log('Traffic update received:', latestUpdate);
      loadData();
    }
  }, [trafficUpdates]);

  useEffect(() => {
    if (violationAlerts.length > 0) {
      const latestAlert = violationAlerts[violationAlerts.length - 1];
      toast.error(`New violation detected: ${latestAlert.type}`, {
        description: latestAlert.location,
      });
      loadData();
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

  const getCongestionColor = (level: string | null) => {
    switch (level?.toLowerCase()) {
      case 'low':
        return 'text-success';
      case 'medium':
        return 'text-warning';
      case 'high':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
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
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text">Traffic Management Dashboard</h1>
          <p className="text-muted-foreground mt-2 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Real-time overview of traffic system status
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
            <span className="text-sm font-medium">System Online</span>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 border rounded-lg ${
            isConnected 
              ? 'bg-green-500/10 border-green-500/20' 
              : 'bg-red-500/10 border-red-500/20'
          }`}>
            <Wifi className={`h-4 w-4 ${isConnected ? 'text-green-500' : 'text-red-500'}`} />
            <span className="text-sm font-medium">
              Socket.io {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-4 grid-cols-1 @container">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 gradient-primary opacity-10"></div>
          <StatCard
            title="Total Vehicles"
            value={stats.totalVehicles}
            icon={Car}
            description="Detected in last hour"
            trend={{ value: 12, isPositive: true }}
          />
        </div>
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 gradient-accent opacity-10"></div>
          <StatCard
            title="Active Signals"
            value={stats.activeSignals}
            icon={Activity}
            description="Traffic lights operational"
          />
        </div>
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-destructive/10"></div>
          <StatCard
            title="Pending Violations"
            value={stats.pendingViolations}
            icon={AlertTriangle}
            description="Awaiting review"
          />
        </div>
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 gradient-success opacity-10"></div>
          <StatCard
            title="Avg Speed"
            value={`${stats.avgSpeed} km/h`}
            icon={Gauge}
            description="Across all locations"
            trend={{ value: 5, isPositive: false }}
          />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3 grid-cols-1">
        <Card className="xl:col-span-2 border-primary/20 shadow-lg glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Live Traffic Map
                </CardTitle>
                <CardDescription>Interactive real-time traffic visualization with Google Maps</CardDescription>
              </div>
              <Badge variant="outline" className="animate-pulse border-primary text-primary">
                LIVE
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden border border-primary/20 shadow-md">
                <TrafficMap signals={signals} flowData={flowData} />
              </div>
              <div className="text-xs text-muted-foreground text-center">
                💡 Tip: Click on markers for detailed signal information
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/30 shadow-lg glass-card hover:shadow-xl transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapIcon className="h-5 w-5 text-primary" />
                OpenStreetMap Traffic View
              </CardTitle>
              <Badge variant="outline" className="border-primary text-primary">
                Leaflet.js
              </Badge>
            </div>
            <CardDescription>
              Free, open-source mapping with CartoDB Dark Matter tiles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg overflow-hidden border border-primary/20 shadow-md">
              <LeafletTrafficMap signals={signals} />
            </div>
            <div className="text-xs text-muted-foreground text-center mt-3">
              🗺️ Powered by OpenStreetMap & Leaflet.js
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-accent/20 shadow-lg glass-card hover:shadow-xl transition-shadow">
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
                className="w-full justify-start hover:bg-primary/10 hover:border-primary transition-all"
                onClick={() => navigate('/detection')}
              >
                <Car className="h-4 w-4 mr-2" />
                Vehicle Detection
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-accent/10 hover:border-accent transition-all"
                onClick={() => navigate('/signals')}
              >
                <Activity className="h-4 w-4 mr-2" />
                Signal Control
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-destructive/10 hover:border-destructive transition-all"
                onClick={() => navigate('/violations')}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                View Violations
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-success/10 hover:border-success transition-all"
                onClick={() => navigate('/analysis')}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Data Analysis
              </Button>
            </CardContent>
          </Card>

          <Card className="border-warning/20 shadow-lg glass-card hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                System Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {violations.length > 0 ? (
                <>
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg hover:bg-destructive/20 transition-colors cursor-pointer" onClick={() => navigate('/violations')}>
                    <p className="text-sm font-medium flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-destructive animate-pulse"></span>
                      {violations.length} Pending Violations
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Requires immediate attention</p>
                  </div>
                  {flowData.some(f => f.congestion_level === 'high') && (
                    <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg hover:bg-warning/20 transition-colors cursor-pointer" onClick={() => navigate('/simulation')}>
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
                <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                  <p className="text-sm font-medium">All Systems Normal</p>
                  <p className="text-xs text-muted-foreground mt-1">No alerts at this time</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2 grid-cols-1">
        <Card className="border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle>Traffic Signals Status</CardTitle>
            <CardDescription>Current status of all traffic lights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {signals.slice(0, 4).map((signal) => (
                <div key={signal.id} className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:border-primary/50 transition-all duration-300 hover:shadow-md">
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

        <Card className="border-accent/20 shadow-lg">
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
                  <div key={violation.id} className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:border-destructive/50 transition-all duration-300 hover:shadow-md">
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
