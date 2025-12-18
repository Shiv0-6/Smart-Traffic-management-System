import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Navigation, Zap } from 'lucide-react';
import { TrafficMap } from '@/components/common/TrafficMap';
import { trafficFlowApi, trafficSignalsApi } from '@/db/api';
import type { TrafficFlow, TrafficSignal } from '@/types/types';
import { toast } from 'sonner';
import HeroBanner from '@/components/common/HeroBanner';

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
      <HeroBanner
        imageSrc="/images/sumo-demo.svg"
        badges={[{ label: 'Simulation', tone: 'primary' }, { label: 'SUMO', tone: 'accent' }]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text">Traffic Flow Simulation</h1>
          <p className="text-muted-foreground mt-2">SUMO-based real-time traffic visualization and predictive analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="animate-pulse">
            <div className="w-2 h-2 rounded-full bg-success mr-2"></div>
            LIVE
          </Badge>
          <Button variant="outline" size="sm" onClick={loadData}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Main Interactive Map */}
      <Card className="border-primary/20 shadow-lg glass-card">
        <CardHeader>
          <div className="flex @container flex-col gap-4">
            <div className="flex @md:flex-row flex-col @md:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Zap className="h-6 w-6 text-primary" />
                  Interactive Traffic Simulation
                </CardTitle>
                <CardDescription className="mt-2">Real-time vehicle trajectories and adaptive signal control</CardDescription>
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
                      Pause Simulation
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Play Simulation
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg overflow-hidden border border-primary/20 shadow-md" style={{ height: '500px' }}>
            <TrafficMap signals={signals} flowData={flowData} />
          </div>
          <div className="text-xs text-muted-foreground text-center mt-3">
            🚗 Simulation Status: {isPlaying ? '▶️ Running' : '⏸️ Paused'} | Signals: {signals.length} | Flow Points: {flowData.length}
          </div>
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="grid gap-6 xl:grid-cols-4 grid-cols-2">
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Signals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{signals.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Traffic lights operational</p>
          </CardContent>
        </Card>
        <Card className="border-accent/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Flow Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{flowData.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Monitored locations</p>
          </CardContent>
        </Card>
        <Card className="border-warning/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Congestion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">
              {flowData.filter(f => f.congestion_level === 'high').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">High congestion zones</p>
          </CardContent>
        </Card>
        <Card className="border-success/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avg Speed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">
              {flowData.length > 0 
                ? Math.round(flowData.reduce((sum, f) => sum + (f.avg_speed || 0), 0) / flowData.length)
                : 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">km/h average</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Tables Grid */}
      <div className="grid gap-6 xl:grid-cols-2 grid-cols-1">
        {/* SUMO Simulation Preview Card */}
        <Card className="border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              SUMO Simulation Engine
            </CardTitle>
            <CardDescription>
              Advanced traffic modeling and simulation framework
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg overflow-hidden border border-primary/20 bg-background">
              <img
                src="/images/sumo-demo.svg"
                alt="SUMO simulation preview"
                className="w-full h-auto"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="font-medium text-primary">Microscopic</p>
                <p className="text-muted-foreground">Individual vehicle modeling</p>
              </div>
              <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                <p className="font-medium text-accent">Adaptive</p>
                <p className="text-muted-foreground">Real-time signal control</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <a href="https://www.eclipse.org/sumo/" target="_blank" rel="noreferrer">
                  Learn SUMO
                </a>
              </Button>
              <Button asChild variant="outline" size="sm" className="flex-1">
                <a href="https://sumo.dlr.de/docs/Tutorials/quick_start.html" target="_blank" rel="noreferrer">
                  Quick Guide
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Traffic Flow Data */}
        <Card className="border-accent/20 shadow-lg">
          <CardHeader>
            <CardTitle>Traffic Flow Data</CardTitle>
            <CardDescription>Live conditions from {flowData.length} monitored locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {flowData.slice(0, 6).map((flow) => (
                <div key={flow.id} className="p-3 border rounded-lg hover:border-primary/50 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{flow.location}</span>
                    <Badge className={getCongestionColor(flow.congestion_level)} variant="outline">
                      {flow.congestion_level || 'N/A'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">🚗</span>
                      <span>{flow.vehicle_count || 0} vehicles</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">⚡</span>
                      <span>{flow.avg_speed || 0} km/h</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">🕐</span>
                      <span>{new Date(flow.timestamp).toLocaleTimeString()}</span>
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
      </div>

      {/* Signal Status Card */}
      <Card className="border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Traffic Signal Status
          </CardTitle>
          <CardDescription>Real-time signal states and timing configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 xl:grid-cols-3 md:grid-cols-2 grid-cols-1">
            {signals.slice(0, 6).map((signal) => (
              <div key={signal.id} className="p-4 border rounded-lg hover:border-primary/50 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getSignalColor(signal.status)} animate-pulse`} />
                    <span className="font-medium text-sm">{signal.location}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">{signal.mode}</Badge>
                </div>
                {signal.timing_config && (
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 bg-destructive/10 rounded">
                      <p className="text-xs text-destructive font-bold">{signal.timing_config.red}s</p>
                      <p className="text-xs text-muted-foreground">Red</p>
                    </div>
                    <div className="text-center p-2 bg-warning/10 rounded">
                      <p className="text-xs text-warning font-bold">{signal.timing_config.yellow}s</p>
                      <p className="text-xs text-muted-foreground">Yellow</p>
                    </div>
                    <div className="text-center p-2 bg-success/10 rounded">
                      <p className="text-xs text-success font-bold">{signal.timing_config.green}s</p>
                      <p className="text-xs text-muted-foreground">Green</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {signals.length > 6 && (
            <p className="text-xs text-muted-foreground text-center mt-4">
              Showing 6 of {signals.length} signals
            </p>
          )}
        </CardContent>
      </Card>

      {/* Historical Playback */}
      <Card className="border-accent/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-accent" />
            Simulation Features
          </CardTitle>
          <CardDescription>Advanced analytics and replay capabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 xl:grid-cols-3 grid-cols-1">
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <p className="font-medium mb-2">📊 Historical Playback</p>
              <p className="text-sm text-muted-foreground">Review traffic patterns from past hours and days. Select date ranges and replay with adjustable speed.</p>
            </div>
            <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
              <p className="font-medium mb-2">⚙️ Adaptive Timing</p>
              <p className="text-sm text-muted-foreground">Webster's method optimization for signal timing. Real-time adjustment based on traffic demand.</p>
            </div>
            <div className="p-4 rounded-lg bg-success/10 border border-success/20">
              <p className="font-medium mb-2">🎯 Predictive Analysis</p>
              <p className="text-sm text-muted-foreground">AI-powered forecasting for future traffic patterns and bottleneck prediction.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrafficSimulation;
