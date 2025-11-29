import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, Video, Car, Bus, Bike, Truck, Activity } from 'lucide-react';
import { vehicleDetectionsApi } from '@/db/api';
import type { VehicleDetection as VehicleDetectionType } from '@/types/types';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/AuthProvider';
import { DeepSORTTracker } from '@/utils/traffic/deepSort';

const VehicleDetection: React.FC = () => {
  const { profile } = useAuth();
  const [detections, setDetections] = useState<VehicleDetectionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const trackerRef = useRef<DeepSORTTracker>(new DeepSORTTracker());
  const [trackedVehicles, setTrackedVehicles] = useState<any[]>([]);
  const [pcuCount, setPcuCount] = useState<number>(0);
  const [vehicleCountByType, setVehicleCountByType] = useState<{
    Heavy: number;
    Medium: number;
    Light: number;
  }>({ Heavy: 0, Medium: 0, Light: 0 });

  const locations = ['Main St & 1st Ave', 'Main St & 2nd Ave', 'Oak St & 1st Ave', 'Oak St & 2nd Ave'];

  useEffect(() => {
    loadDetections();
    const interval = setInterval(loadDetections, 10000);
    return () => clearInterval(interval);
  }, [selectedLocation]);

  useEffect(() => {
    const interval = setInterval(() => {
      const tracks = trackerRef.current.getTracks();
      setTrackedVehicles(tracks);
      setPcuCount(trackerRef.current.getTotalPCU());
      setVehicleCountByType(trackerRef.current.getCountByType());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadDetections = async () => {
    try {
      const data = selectedLocation === 'all'
        ? await vehicleDetectionsApi.getAll(50)
        : await vehicleDetectionsApi.getByLocation(selectedLocation);
      setDetections(data);
    } catch (error: any) {
      toast.error('Failed to load detections');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        toast.error('File size must be less than 100MB');
        return;
      }
      setVideoFile(file);
      toast.success('Video file selected. In production, this would be sent to YOLO detection service.');
    }
  };

  const getVehicleIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'car':
        return <Car className="h-4 w-4" />;
      case 'bus':
        return <Bus className="h-4 w-4" />;
      case 'motorcycle':
      case 'bike':
        return <Bike className="h-4 w-4" />;
      case 'truck':
        return <Truck className="h-4 w-4" />;
      default:
        return <Car className="h-4 w-4" />;
    }
  };

  const vehicleStats = detections.reduce((acc, detection) => {
    acc[detection.vehicle_type] = (acc[detection.vehicle_type] || 0) + detection.count;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Vehicle Detection</h1>
        <p className="text-muted-foreground mt-1">YOLO-based real-time vehicle detection and monitoring</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-3 grid-cols-1">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Video Upload & Live Stream</CardTitle>
            <CardDescription>Upload traffic video or connect to live CCTV feed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="video-upload">Upload Video File</Label>
              <div className="flex gap-2">
                <Input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="flex-1"
                />
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stream-url">Live Stream URL</Label>
              <div className="flex gap-2">
                <Input
                  id="stream-url"
                  type="text"
                  placeholder="rtsp://camera-ip:port/stream"
                />
                <Button variant="outline">
                  <Video className="h-4 w-4 mr-2" />
                  Connect
                </Button>
              </div>
            </div>

            <div className="border-2 border-dashed rounded-lg p-8 text-center bg-muted/10">
              <Video className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Video preview and detection visualization will appear here
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                In production, this connects to YOLO detection service
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>DeepSORT Tracking Statistics</CardTitle>
            <CardDescription>Real-time vehicle tracking with PCU calculation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <span className="font-medium">Total PCU</span>
                  </div>
                  <span className="text-2xl font-bold text-primary">
                    {pcuCount.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Passenger Car Units (weighted traffic volume)
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-lg bg-red-500/10 border-red-500/20">
                  <div className="flex items-center gap-2">
                    <Bus className="h-4 w-4 text-red-500" />
                    <span className="font-medium">Heavy (Bus/Truck)</span>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-red-500">{vehicleCountByType.Heavy}</Badge>
                    <p className="text-xs text-muted-foreground mt-1">PCU: 3.0</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg bg-yellow-500/10 border-yellow-500/20">
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">Medium (Car)</span>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-yellow-500">{vehicleCountByType.Medium}</Badge>
                    <p className="text-xs text-muted-foreground mt-1">PCU: 1.0</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg bg-green-500/10 border-green-500/20">
                  <div className="flex items-center gap-2">
                    <Bike className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Light (Bike)</span>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-500">{vehicleCountByType.Light}</Badge>
                    <p className="text-xs text-muted-foreground mt-1">PCU: 0.5</p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/50 border border-border">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Active Tracks</span>
                  <span className="text-lg font-bold">{trackedVehicles.length}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Unique vehicles currently tracked
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col @container gap-4">
            <div className="flex @md:flex-row flex-col @md:items-center justify-between gap-4">
              <div>
                <CardTitle>Detection History</CardTitle>
                <CardDescription>Recent vehicle detections by location</CardDescription>
              </div>
              <div className="@md:w-64 w-full">
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map((loc) => (
                      <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-2">
              {detections.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No detections found
                </p>
              ) : (
                <div className="grid gap-2">
                  {detections.map((detection) => (
                    <div key={detection.id} className="flex @container items-center justify-between p-3 border rounded-lg">
                      <div className="flex @md:flex-row flex-col @md:items-center gap-3 flex-1">
                        <div className="flex items-center gap-2">
                          {getVehicleIcon(detection.vehicle_type)}
                          <span className="font-medium capitalize">{detection.vehicle_type}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {detection.location}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(detection.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Count: {detection.count}</Badge>
                        {detection.confidence && (
                          <Badge variant="secondary">
                            {Math.round(detection.confidence * 100)}%
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleDetection;
