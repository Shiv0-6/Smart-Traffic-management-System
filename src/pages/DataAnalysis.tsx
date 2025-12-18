import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp, Calendar } from 'lucide-react';
import { vehicleDetectionsApi, trafficFlowApi, violationsApi } from '@/db/api';
import { toast } from 'sonner';
import PeakHourHeatmap from '@/components/charts/PeakHourHeatmap';
import ViolationTypesPieChart from '@/components/charts/ViolationTypesPieChart';

const DataAnalysis: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');
  const [vehicleData, setVehicleData] = useState<any[]>([]);
  const [flowData, setFlowData] = useState<any[]>([]);
  const [violationData, setViolationData] = useState<any[]>([]);

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    try {
      const [detections, flows, violations] = await Promise.all([
        vehicleDetectionsApi.getStats(),
        trafficFlowApi.getAll(50),
        violationsApi.getAll(50),
      ]);

      const vehicleTypeStats = detections.reduce((acc: any, d: any) => {
        const existing = acc.find((item: any) => item.name === d.vehicle_type);
        if (existing) {
          existing.value += d.count;
        } else {
          acc.push({ name: d.vehicle_type, value: d.count });
        }
        return acc;
      }, []);
      setVehicleData(vehicleTypeStats);

      const flowByLocation = flows.reduce((acc: any, f: any) => {
        const existing = acc.find((item: any) => item.location === f.location);
        if (existing) {
          existing.avgSpeed = (existing.avgSpeed + (f.avg_speed || 0)) / 2;
          existing.vehicles += f.vehicle_count || 0;
        } else {
          acc.push({
            location: f.location.split('&')[0].trim(),
            avgSpeed: f.avg_speed || 0,
            vehicles: f.vehicle_count || 0,
          });
        }
        return acc;
      }, []);
      setFlowData(flowByLocation.slice(0, 6));

      const violationsByType = violations.reduce((acc: any, v: any) => {
        const existing = acc.find((item: any) => item.type === v.violation_type);
        if (existing) {
          existing.count += 1;
        } else {
          acc.push({ type: v.violation_type.replace('_', ' '), count: 1 });
        }
        return acc;
      }, []);
      setViolationData(violationsByType);

    } catch (error: any) {
      toast.error('Failed to load analytics data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  const handleExport = () => {
    toast.success('Data export functionality would be implemented here');
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
            <h1 className="text-3xl font-bold">Data Analysis</h1>
            <p className="text-muted-foreground mt-1">Traffic patterns and statistical insights</p>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2 grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Type Distribution</CardTitle>
            <CardDescription>Breakdown of detected vehicle types</CardDescription>
          </CardHeader>
          <CardContent>
            {vehicleData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No vehicle data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={vehicleData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {vehicleData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic Flow by Location</CardTitle>
            <CardDescription>Average speed and vehicle count</CardDescription>
          </CardHeader>
          <CardContent>
            {flowData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No flow data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={flowData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="location" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avgSpeed" fill="hsl(var(--chart-1))" name="Avg Speed (km/h)" />
                  <Bar dataKey="vehicles" fill="hsl(var(--chart-2))" name="Vehicle Count" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Violation Types</CardTitle>
            <CardDescription>Distribution of traffic violations</CardDescription>
          </CardHeader>
          <CardContent>
            {violationData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No violation data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={violationData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="type" type="category" width={120} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--destructive))" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic Trends</CardTitle>
            <CardDescription>Historical traffic patterns over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground">
              <TrendingUp className="h-12 w-12 mb-2" />
              <p className="text-sm">Time-series trend analysis</p>
              <p className="text-xs mt-1">Historical data visualization would appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Congestion Heatmap</CardTitle>
          <CardDescription>Traffic congestion intensity across locations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed rounded-lg p-12 text-center bg-muted/10 min-h-[300px] flex flex-col items-center justify-center">
            <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground mb-2">
              Interactive Heatmap Visualization
            </p>
            <p className="text-sm text-muted-foreground max-w-md">
              In production, this displays a color-coded heatmap showing congestion levels
              across different locations and time periods.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold">Advanced Analytics (Chart.js)</h2>
      </div>

      <div className="grid gap-6 xl:grid-cols-2 grid-cols-1">
        <PeakHourHeatmap />
        <ViolationTypesPieChart />
      </div>
    </div>
  </div>
  );
};

export default DataAnalysis;
