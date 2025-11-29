import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Clock, Navigation, AlertTriangle, Zap } from 'lucide-react';

interface TrafficAnalyticsProps {
  className?: string;
}

export const TrafficAnalytics: React.FC<TrafficAnalyticsProps> = ({ className }) => {
  const [analytics, setAnalytics] = useState({
    avgTravelTime: 12,
    trafficIndex: 65,
    incidents: 3,
    optimalRoutes: 8,
    congestionLevel: 'medium',
    peakHours: ['8:00 AM', '5:30 PM'],
    efficiency: 78,
  });

  const routes = [
    {
      name: 'Main St Route',
      distance: '3.2 km',
      duration: '8 min',
      traffic: 'light',
      savings: '+2 min faster',
      efficiency: 92,
    },
    {
      name: 'Oak St Route',
      distance: '2.8 km',
      duration: '12 min',
      traffic: 'moderate',
      savings: 'Standard route',
      efficiency: 75,
    },
    {
      name: 'Express Route',
      distance: '4.1 km',
      duration: '7 min',
      traffic: 'light',
      savings: '+3 min faster',
      efficiency: 95,
    },
  ];

  const predictions = [
    {
      time: 'Next 15 min',
      congestion: 'Low',
      confidence: 95,
      trend: 'stable',
    },
    {
      time: 'Next 30 min',
      congestion: 'Medium',
      confidence: 88,
      trend: 'increasing',
    },
    {
      time: 'Next 1 hour',
      congestion: 'High',
      confidence: 72,
      trend: 'increasing',
    },
  ];

  const getTrafficColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'light':
        return 'text-success';
      case 'moderate':
        return 'text-warning';
      case 'heavy':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-3 w-3 text-destructive" />;
      case 'decreasing':
        return <TrendingDown className="h-3 w-3 text-success" />;
      default:
        return <div className="h-3 w-3 rounded-full bg-warning" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid gap-4 xl:grid-cols-4 grid-cols-2">
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Travel Time</p>
                <p className="text-2xl font-bold">{analytics.avgTravelTime} min</p>
              </div>
              <Clock className="h-8 w-8 text-primary opacity-50" />
            </div>
            <Progress value={analytics.avgTravelTime * 5} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-accent/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Traffic Index</p>
                <p className="text-2xl font-bold">{analytics.trafficIndex}%</p>
              </div>
              <Navigation className="h-8 w-8 text-accent opacity-50" />
            </div>
            <Progress value={analytics.trafficIndex} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-warning/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Incidents</p>
                <p className="text-2xl font-bold">{analytics.incidents}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning opacity-50" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              2 accidents, 1 roadwork
            </div>
          </CardContent>
        </Card>

        <Card className="border-success/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">System Efficiency</p>
                <p className="text-2xl font-bold">{analytics.efficiency}%</p>
              </div>
              <Zap className="h-8 w-8 text-success opacity-50" />
            </div>
            <Progress value={analytics.efficiency} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2 grid-cols-1">
        <Card className="border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-primary" />
              Optimal Routes
            </CardTitle>
            <CardDescription>AI-recommended routes based on real-time traffic</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {routes.map((route, idx) => (
                <div
                  key={idx}
                  className="p-4 border border-border/50 rounded-lg hover:border-primary/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">{route.name}</h4>
                    <Badge variant="outline" className={getTrafficColor(route.traffic)}>
                      {route.traffic}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground mb-2">
                    <div>
                      <p>Distance</p>
                      <p className="font-semibold text-foreground">{route.distance}</p>
                    </div>
                    <div>
                      <p>Duration</p>
                      <p className="font-semibold text-foreground">{route.duration}</p>
                    </div>
                    <div>
                      <p>Efficiency</p>
                      <p className="font-semibold text-foreground">{route.efficiency}%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-success">{route.savings}</span>
                    <Progress value={route.efficiency} className="w-24 h-1" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-accent/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Traffic Predictions
            </CardTitle>
            <CardDescription>AI-powered traffic forecasting</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {predictions.map((pred, idx) => (
                <div
                  key={idx}
                  className="p-4 border border-border/50 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">{pred.time}</span>
                    </div>
                    {getTrendIcon(pred.trend)}
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Congestion Level</span>
                    <Badge
                      variant="outline"
                      className={
                        pred.congestion === 'Low'
                          ? 'text-success'
                          : pred.congestion === 'Medium'
                          ? 'text-warning'
                          : 'text-destructive'
                      }
                    >
                      {pred.congestion}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Confidence</span>
                    <div className="flex items-center gap-2">
                      <Progress value={pred.confidence} className="w-20 h-1" />
                      <span className="text-xs font-medium">{pred.confidence}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-warning/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Real-time Incidents
          </CardTitle>
          <CardDescription>Current traffic incidents and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm">Accident on Main St</h4>
                <Badge variant="destructive">High Impact</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Near intersection with 2nd Ave • Reported 15 min ago
              </p>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-destructive">+8 min delay</span>
                <span className="text-muted-foreground">2 lanes blocked</span>
              </div>
            </div>

            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm">Roadwork on Oak St</h4>
                <Badge variant="outline" className="text-warning">Medium Impact</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Between 1st and 2nd Ave • Active until 6:00 PM
              </p>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-warning">+4 min delay</span>
                <span className="text-muted-foreground">1 lane closed</span>
              </div>
            </div>

            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm">Heavy Traffic Alert</h4>
                <Badge variant="outline" className="text-primary">Low Impact</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Main St corridor • Expected to clear in 20 min
              </p>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-primary">+2 min delay</span>
                <span className="text-muted-foreground">All lanes open</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
