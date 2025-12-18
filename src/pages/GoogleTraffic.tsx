import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GoogleTrafficMap } from '@/components/common/GoogleTrafficMap';
import { TrafficAnalytics } from '@/components/common/TrafficAnalytics';
import LeafletTrafficMap from '@/components/maps/LeafletTrafficMap';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, BarChart3, Route, Zap, RefreshCw } from 'lucide-react';
import { trafficSignalsApi, trafficFlowApi } from '@/db/api';
import type { TrafficSignal, TrafficFlow } from '@/types/types';
import { toast } from 'sonner';

const AdvancedTraffic: React.FC = () => {
  const [signals, setSignals] = useState<TrafficSignal[]>([]);
  const [flowData, setFlowData] = useState<TrafficFlow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('map');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [signalsData, flowsData] = await Promise.all([
        trafficSignalsApi.getAll(),
        trafficFlowApi.getAll(50),
      ]);
      setSignals(signalsData);
      setFlowData(flowsData);
    } catch (error: any) {
      toast.error('Failed to load traffic data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on selected location
  const filteredFlowData = selectedLocation === 'all' 
    ? flowData 
    : flowData.filter(f => f.location === selectedLocation);

  const filteredSignals = selectedLocation === 'all'
    ? signals
    : signals.filter(s => s.location.includes(selectedLocation.split('&')[0]));

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

      <div className="flex gap-4 items-end">
        <div className="flex-1 max-w-xs">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Select Location</label>
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {[...new Set(flowData.map(f => f.location))].map(location => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          <div className="grid gap-6 xl:grid-cols-2 grid-cols-1">
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
                <GoogleTrafficMap signals={filteredSignals} />
              </CardContent>
            </Card>

            <Card className="border-accent/20 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-accent" />
                      OpenStreetMap View
                    </CardTitle>
                    <CardDescription>
                      Free, open-source mapping with CartoDB tiles
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="border-accent text-accent">
                    Leaflet.js
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <LeafletTrafficMap signals={filteredSignals} />
              </CardContent>
            </Card>
          </div>

          <Card className="border-accent/20 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-accent" />
                    Standard Map View
                  </CardTitle>
                  <CardDescription>
                    Clean map visualization with traffic signal markers
                  </CardDescription>
                </div>
                <Badge variant="outline" className="border-accent text-accent">
                  Standard
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <LeafletTrafficMap signals={filteredSignals} zoom={14} />
              <div className="text-xs text-muted-foreground text-center mt-3">
                📍 All signals and traffic locations for {selectedLocation === 'all' ? 'your region' : selectedLocation}
              </div>
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
                  {filteredFlowData.length > 0 ? (
                    <>
                      <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                        <span className="text-sm">Light Traffic</span>
                        <Badge variant="outline" className="text-success">
                          {filteredFlowData.filter(f => f.congestion_level === 'low').length}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                        <span className="text-sm">Moderate Traffic</span>
                        <Badge variant="outline" className="text-warning">
                          {filteredFlowData.filter(f => f.congestion_level === 'medium').length}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                        <span className="text-sm">Heavy Traffic</span>
                        <Badge variant="outline" className="text-destructive">
                          {filteredFlowData.filter(f => f.congestion_level === 'high').length}
                        </Badge>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No traffic data for selected location</p>
                  )}
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
                    <span className="text-sm">Active Signals</span>
                    <span className="text-sm font-bold text-primary">{filteredSignals.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Traffic Locations</span>
                    <span className="text-sm font-bold text-accent">{filteredFlowData.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Avg Speed</span>
                    <span className="text-sm font-bold text-success">
                      {filteredFlowData.length > 0 
                        ? Math.round(filteredFlowData.reduce((sum, f) => sum + (f.avg_speed || 0), 0) / filteredFlowData.length)
                        : 0} km/h
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Data Freshness</span>
                    <span className="text-sm font-bold text-success">Live</span>
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
