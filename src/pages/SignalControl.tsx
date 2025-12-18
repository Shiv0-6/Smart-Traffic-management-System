import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Activity, Settings, Zap, Shield, Eye, Lock, TrendingUp } from 'lucide-react';
import { trafficSignalsApi } from '@/db/api';
import type { TrafficSignal } from '@/types/types';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/AuthProvider';
import { useAdmin } from '@/hooks/useAdmin';
import { WebsterSignalController, type LaneFlow } from '@/utils/traffic/websterMethod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const SignalControl: React.FC = () => {
  const { profile } = useAuth();
  const { isAdmin: isAdminRole } = useAdmin();
  const [signals, setSignals] = useState<TrafficSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSignal, setSelectedSignal] = useState<TrafficSignal | null>(null);
  const [timingConfig, setTimingConfig] = useState({ red: 45, yellow: 5, green: 50 });
  const websterController = useRef(new WebsterSignalController());
  const [websterRecommendation, setWebsterRecommendation] = useState<any>(null);

  const isOperator = profile?.role === 'admin' || profile?.role === 'operator';
  const isAdmin = isAdminRole || profile?.role === 'admin';
  const controlUserId = profile?.id;

  useEffect(() => {
    loadSignals();
    const interval = setInterval(loadSignals, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const sampleLanes: LaneFlow[] = [
        {
          laneId: 'lane1',
          saturationFlow: 1800,
          actualFlow: Math.random() * 1500 + 300,
          queueLength: Math.floor(Math.random() * 15),
        },
        {
          laneId: 'lane2',
          saturationFlow: 1800,
          actualFlow: Math.random() * 1400 + 200,
          queueLength: Math.floor(Math.random() * 12),
        },
      ];

      const recommendation = websterController.current.getRecommendedAction(sampleLanes);
      const cycleLength = websterController.current.calculateCycleLength(sampleLanes);
      setWebsterRecommendation({ ...recommendation, cycleLength });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadSignals = async () => {
    try {
      const data = await trafficSignalsApi.getAll();
      setSignals(data);
    } catch (error: any) {
      toast.error('Failed to load signals');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleModeToggle = async (signal: TrafficSignal) => {
    if (!isOperator || !controlUserId) {
      toast.error('Only operators and admins can control signals. Please sign in.');
      return;
    }

    try {
      const newMode = signal.mode === 'auto' ? 'manual' : 'auto';
      const updated = await trafficSignalsApi.updateMode(signal.id, newMode, controlUserId);
      setSignals((prev) => prev.map((s) => (s.id === signal.id ? { ...s, ...updated } : s)));
      toast.success(`Signal mode changed to ${newMode}`);
    } catch (error: any) {
      toast.error('Failed to update signal mode');
      console.error(error);
    }
  };

  const handleStatusChange = async (signal: TrafficSignal, newStatus: string) => {
    if (!isOperator || !controlUserId) {
      toast.error('Only operators and admins can control signals. Please sign in.');
      return;
    }

    if (signal.mode === 'auto') {
      toast.error('Switch to manual mode first');
      return;
    }

    try {
      const updated = await trafficSignalsApi.updateStatus(signal.id, newStatus, controlUserId);
      setSignals((prev) => prev.map((s) => (s.id === signal.id ? { ...s, ...updated } : s)));
      toast.success(`Signal status changed to ${newStatus}`);
    } catch (error: any) {
      toast.error('Failed to update signal status');
      console.error(error);
    }
  };

  const handleTimingUpdate = async () => {
    if (!isOperator || !selectedSignal || !controlUserId) {
      toast.error('Only operators and admins can control signals. Please sign in.');
      return;
    }

    try {
      const updated = await trafficSignalsApi.updateTiming(selectedSignal.id, timingConfig, controlUserId);
      setSignals((prev) => prev.map((s) => (s.id === selectedSignal.id ? { ...s, ...updated } : s)));
      toast.success('Timing configuration updated');
      setSelectedSignal(null);
    } catch (error: any) {
      toast.error('Failed to update timing');
      console.error(error);
    }
  };

  const getStatusColor = (status: string) => {
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
      <div className="flex @container flex-col gap-4">
        <div className="flex @md:flex-row flex-col @md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold gradient-text flex items-center gap-3">
              <Activity className="h-8 w-8 text-primary" />
              Signal Control
            </h1>
            <p className="text-muted-foreground mt-2">
              {isOperator ? 'Manage traffic signal timing and modes' : 'View traffic signal status (read-only). Sign in as admin/operator to control.'}
            </p>
          </div>
          {isAdmin ? (
            <Badge className="w-fit bg-gradient-accent text-white border-0 shadow-md">
              <Shield className="h-3 w-3 mr-1" />
              Admin Access
            </Badge>
          ) : (
            <Badge variant="secondary" className="w-fit shadow-md">
              <Eye className="h-3 w-3 mr-1" />
              View Only
            </Badge>
          )}
        </div>
      </div>

      {websterRecommendation && (
        <Card className="glass-card border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Webster's Method - Adaptive Signal Timing
            </CardTitle>
            <CardDescription>
              Real-time traffic flow analysis and signal timing recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 xl:grid-cols-3 grid-cols-1">
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <div className="text-sm text-muted-foreground mb-1">
                  Recommended Action
                </div>
                <div className="text-2xl font-bold capitalize">
                  {websterRecommendation.action}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {websterRecommendation.reason}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="text-sm text-muted-foreground mb-1">
                  Optimal Cycle Length
                </div>
                <div className="text-2xl font-bold">
                  {Math.round(websterRecommendation.cycleLength)}s
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Based on current flow ratios
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="text-sm text-muted-foreground mb-1">
                  Queue Extension Logic
                </div>
                <div className="text-sm font-medium mt-2">
                  If queue &gt; 10 vehicles
                </div>
                <div className="text-xs text-muted-foreground">
                  Extend green time by +10s
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-2">
                <Activity className="h-4 w-4 text-blue-500 mt-0.5" />
                <div className="text-sm">
                  <strong>Formula:</strong> Cycle_Length = (1.5 × Loss_Time + 5) / (1 - Sum_of_Flow_Ratios)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 xl:grid-cols-2 grid-cols-1">
        {signals.map((signal) => (
          <Card key={signal.id} className="glass-card hover:shadow-xl transition-all border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${getStatusColor(signal.status)} animate-pulse shadow-lg`} />
                  <CardTitle className="text-lg">{signal.location}</CardTitle>
                </div>
                <Badge variant={signal.mode === 'auto' ? 'default' : 'secondary'} className="shadow-sm">
                  {signal.mode === 'auto' ? (
                    <>
                      <Zap className="h-3 w-3 mr-1" />
                      AI Auto
                    </>
                  ) : (
                    <>
                      <Lock className="h-3 w-3 mr-1" />
                      Manual
                    </>
                  )}
                </Badge>
              </div>
              <CardDescription>
                Last updated: {new Date(signal.last_updated).toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Control Mode</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {signal.mode === 'auto' ? 'Auto' : 'Manual'}
                  </span>
                  <Switch
                    checked={signal.mode === 'auto'}
                    onCheckedChange={() => handleModeToggle(signal)}
                    disabled={!isOperator}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Current Status</Label>
                <div className="flex gap-2">
                  <Button
                    variant={signal.status === 'red' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => handleStatusChange(signal, 'red')}
                    disabled={!isOperator || signal.mode === 'auto'}
                  >
                    <div className="w-2 h-2 rounded-full bg-destructive mr-2" />
                    Red
                  </Button>
                  <Button
                    variant={signal.status === 'yellow' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => handleStatusChange(signal, 'yellow')}
                    disabled={!isOperator || signal.mode === 'auto'}
                  >
                    <div className="w-2 h-2 rounded-full bg-warning mr-2" />
                    Yellow
                  </Button>
                  <Button
                    variant={signal.status === 'green' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => handleStatusChange(signal, 'green')}
                    disabled={!isOperator || signal.mode === 'auto'}
                  >
                    <div className="w-2 h-2 rounded-full bg-success mr-2" />
                    Green
                  </Button>
                </div>
              </div>

              {signal.timing_config && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Timing Configuration</Label>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="p-2 border rounded text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <div className="w-2 h-2 rounded-full bg-destructive"></div>
                        <span className="text-xs text-muted-foreground">Red</span>
                      </div>
                      <p className="font-semibold">{signal.timing_config.red}s</p>
                    </div>
                    <div className="p-2 border rounded text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <div className="w-2 h-2 rounded-full bg-warning"></div>
                        <span className="text-xs text-muted-foreground">Yellow</span>
                      </div>
                      <p className="font-semibold">{signal.timing_config.yellow}s</p>
                    </div>
                    <div className="p-2 border rounded text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <div className="w-2 h-2 rounded-full bg-success"></div>
                        <span className="text-xs text-muted-foreground">Green</span>
                      </div>
                      <p className="font-semibold">{signal.timing_config.green}s</p>
                    </div>
                  </div>
                </div>
              )}

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={!isOperator}
                    onClick={() => {
                      setSelectedSignal(signal);
                      setTimingConfig(signal.timing_config || { red: 45, yellow: 5, green: 50 });
                    }}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Timing
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Configure Signal Timing</DialogTitle>
                    <DialogDescription>
                      Adjust timing for {signal.location}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="red-time">Red Light Duration (seconds)</Label>
                      <Input
                        id="red-time"
                        type="number"
                        value={timingConfig.red}
                        onChange={(e) => setTimingConfig({ ...timingConfig, red: parseInt(e.target.value) || 0 })}
                        min="10"
                        max="120"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="yellow-time">Yellow Light Duration (seconds)</Label>
                      <Input
                        id="yellow-time"
                        type="number"
                        value={timingConfig.yellow}
                        onChange={(e) => setTimingConfig({ ...timingConfig, yellow: parseInt(e.target.value) || 0 })}
                        min="3"
                        max="10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="green-time">Green Light Duration (seconds)</Label>
                      <Input
                        id="green-time"
                        type="number"
                        value={timingConfig.green}
                        onChange={(e) => setTimingConfig({ ...timingConfig, green: parseInt(e.target.value) || 0 })}
                        min="10"
                        max="120"
                      />
                    </div>
                    <Button onClick={handleTimingUpdate} className="w-full">
                      Update Timing
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SignalControl;
