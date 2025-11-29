import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, MapPin, Navigation, Zap } from 'lucide-react';
import { TrafficMap } from '@/components/common/TrafficMap';
import { trafficFlowApi, trafficSignalsApi } from '@/db/api';
import type { TrafficFlow, TrafficSignal } from '@/types/types';
import { toast } from 'sonner';

const TrafficSimulation: React.FC = () => {
  const [flowData, setFlowData] = useState<TrafficFlow[]>([]);
  const [signals, setSignals] = useState<TrafficSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [flowResult, signalsResult] = await Promise.all([
        trafficFlowApi.getAll(20),
        trafficSignalsApi.getAll(),
      ]);
      setFlowData(flowResult);
      setSignals(signalsResult);
    } catch (error: any) {
      toast.error('Failed to load simulation data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getCongestionColor = (level: string | null) => {
    switch (level?.toLowerCase()) {
      case 'low':
        return 'bg-success/20 text-success border-success';
      case 'medium':
        return 'bg-warning/20 text-warning border-warning';
      case 'high':
        return 'bg-destructive/20 text-destructive border-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getSignalColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'green':
        return 'bg-success';
      case 'yellow':
        return 'bg-warning';
      case 'red':
        return 'bg-destructive';
      default:
        return 'bg-muted';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Traffic Flow Simulation</h1>
        <p className="text-muted-foreground mt-1">SUMO-based traffic flow visualization and analysis</p>
      </div>

      <Card className="border-primary/20 shadow-lg">
        <CardHeader>
          <div className="flex @container flex-col gap-4">
            <div className="flex @md:flex-row flex-col @md:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Interactive Traffic Map
                </CardTitle>
                <CardDescription>Real-time vehicle trajectories and signal status</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={isPlaying ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={isPlaying ? "glow-primary" : ""}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Play
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={loadData}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TrafficMap signals={signals} flowData={flowData} />
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2 grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Traffic Flow Data</CardTitle>
            <CardDescription>Current traffic conditions by location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {flowData.slice(0, 8).map((flow) => (
                <div key={flow.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Navigation className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{flow.location}</span>
                    </div>
                    <Badge className={getCongestionColor(flow.congestion_level)}>
                      {flow.congestion_level || 'N/A'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Vehicles</p>
                      <p className="font-semibold">{flow.vehicle_count || 0}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Avg Speed</p>
                      <p className="font-semibold">{flow.avg_speed || 0} km/h</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Updated</p>
                      <p className="font-semibold text-xs">
                        {new Date(flow.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {flowData.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No traffic flow data available
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Signal Status</CardTitle>
            <CardDescription>Current traffic light states</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {signals.map((signal) => (
                <div key={signal.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${getSignalColor(signal.status)} animate-pulse`} />
                      <span className="font-medium">{signal.location}</span>
                    </div>
                    <Badge variant="outline">{signal.mode}</Badge>
                  </div>
                  {signal.timing_config && (
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-destructive"></div>
                        <span>{signal.timing_config.red}s</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-warning"></div>
                        <span>{signal.timing_config.yellow}s</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-success"></div>
                        <span>{signal.timing_config.green}s</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historical Playback</CardTitle>
          <CardDescription>Review past traffic patterns and simulation data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-8 text-center bg-muted/10">
            <p className="text-sm text-muted-foreground">
              Historical data playback controls and timeline visualization will be available here.
              Users can select date ranges and replay traffic patterns.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrafficSimulation;
