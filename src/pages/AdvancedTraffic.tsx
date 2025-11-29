import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GoogleTrafficMap } from '@/components/common/GoogleTrafficMap';
import { TrafficAnalytics } from '@/components/common/TrafficAnalytics';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, BarChart3, Route, Zap, RefreshCw } from 'lucide-react';
import { trafficSignalsApi } from '@/db/api';
import type { TrafficSignal } from '@/types/types';
import { toast } from 'sonner';

const AdvancedTraffic: React.FC = () => {
  const [signals, setSignals] = useState<TrafficSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('map');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const signalsData = await trafficSignalsApi.getAll();
      setSignals(signalsData);
    } catch (error: any) {
      toast.error('Failed to load traffic data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary glow-primary"></div>
          <p className="text-muted-foreground">Loading advanced traffic data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text">Advanced Traffic Intelligence</h1>
          <p className="text-muted-foreground mt-2 flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Real-time Google Maps integration with AI-powered analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="animate-pulse">
            <div className="w-2 h-2 rounded-full bg-success mr-2"></div>
            LIVE DATA
          </Badge>
          <Button variant="outline" size="sm" onClick={loadData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full xl:w-auto xl:inline-grid grid-cols-3 gap-2">
          <TabsTrigger value="map" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Live Map
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="routes" className="flex items-center gap-2">
            <Route className="h-4 w-4" />
            Route Planning
          </TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-6">
          <Card className="border-primary/20 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Google Maps Traffic View
                  </CardTitle>
                  <CardDescription>
                    Real-time traffic conditions with signal status overlay
                  </CardDescription>
                </div>
                <Badge variant="default" className="gradient-primary">
                  Google Maps API
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <GoogleTrafficMap signals={signals} />
            </CardContent>
          </Card>

          <div className="grid gap-6 xl:grid-cols-3 grid-cols-1">
            <Card className="border-success/20">
              <CardHeader>
                <CardTitle className="text-lg">Traffic Flow</CardTitle>
                <CardDescription>Current traffic conditions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                    <span className="text-sm">Light Traffic</span>
                    <Badge variant="outline" className="text-success">45%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                    <span className="text-sm">Moderate Traffic</span>
                    <Badge variant="outline" className="text-warning">35%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                    <span className="text-sm">Heavy Traffic</span>
                    <Badge variant="outline" className="text-destructive">20%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Peak Hours</CardTitle>
                <CardDescription>High traffic periods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm font-medium">Morning Rush</p>
                    <p className="text-xs text-muted-foreground">7:00 AM - 9:30 AM</p>
                    <Badge variant="destructive" className="mt-2">High Congestion</Badge>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm font-medium">Evening Rush</p>
                    <p className="text-xs text-muted-foreground">5:00 PM - 7:30 PM</p>
                    <Badge variant="destructive" className="mt-2">High Congestion</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle className="text-lg">System Status</CardTitle>
                <CardDescription>Overall performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Signal Efficiency</span>
                    <span className="text-sm font-bold text-success">92%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Response Time</span>
                    <span className="text-sm font-bold text-primary">1.2s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Sensors</span>
                    <span className="text-sm font-bold text-accent">24/24</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Data Accuracy</span>
                    <span className="text-sm font-bold text-success">98%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <TrafficAnalytics />
        </TabsContent>

        <TabsContent value="routes" className="space-y-6">
          <Card className="border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5 text-primary" />
                Intelligent Route Planning
              </CardTitle>
              <CardDescription>
                AI-optimized routes using real-time Google Maps data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Route className="h-16 w-16 mx-auto text-muted-foreground mb-4 animate-float" />
                <h3 className="text-lg font-semibold mb-2">Route Optimization Engine</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                  Advanced route planning with real-time traffic data, incident avoidance,
                  and predictive analytics for optimal path selection.
                </p>
                <div className="grid gap-4 xl:grid-cols-3 grid-cols-1 max-w-3xl mx-auto">
                  <div className="p-4 border rounded-lg">
                    <Zap className="h-8 w-8 mx-auto text-primary mb-2" />
                    <p className="font-medium text-sm">Real-time Updates</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Live traffic conditions
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <BarChart3 className="h-8 w-8 mx-auto text-accent mb-2" />
                    <p className="font-medium text-sm">Predictive Analysis</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Future traffic patterns
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <MapPin className="h-8 w-8 mx-auto text-success mb-2" />
                    <p className="font-medium text-sm">Multi-route Options</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Alternative paths
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedTraffic;
