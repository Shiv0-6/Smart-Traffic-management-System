"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrafficMap } from "@/components/ui/traffic-map";

export default function TrafficManagementSystem() {
  const [aiMode, setAiMode] = useState(false);
  const [trafficLights, setTrafficLights] = useState({
    north: "red",
    south: "red", 
    east: "green",
    west: "green"
  });
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState([
    { type: "car", count: 12, confidence: 0.95 },
    { type: "truck", count: 3, confidence: 0.88 },
    { type: "pedestrian", count: 8, confidence: 0.92 }
  ]);

  const toggleTrafficLight = (direction: string) => {
    if (!aiMode) {
      setTrafficLights(prev => ({
        ...prev,
        [direction]: prev[direction as keyof typeof prev] === "red" ? "green" : "red"
      }));
    }
  };

  const getTrafficLightColor = (state: string) => {
    switch (state) {
      case "red": return "bg-red-500";
      case "yellow": return "bg-yellow-500";
      case "green": return "bg-green-500";
      default: return "bg-gray-300";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Smart Traffic Management System
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          AI-Powered Traffic Control with YOLO Detection & SUMO Simulation
        </p>
      </div>

      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            System Control
            <div className="flex items-center space-x-2">
              <span className="text-sm">Manual</span>
              <Switch checked={aiMode} onCheckedChange={setAiMode} />
              <span className="text-sm">AI Mode</span>
            </div>
          </CardTitle>
          <CardDescription>
            {aiMode ? "AI is managing traffic flow automatically" : "Manual control enabled"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              {aiMode 
                ? "🤖 AI system is analyzing traffic patterns and optimizing signal timing"
                : "👤 Manual mode: Click on traffic lights to control them manually"
              }
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Tabs defaultValue="traffic-control" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="traffic-control">Traffic Control</TabsTrigger>
          <TabsTrigger value="yolo-detection">YOLO Detection</TabsTrigger>
          <TabsTrigger value="sumo-simulation">SUMO Simulation</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Traffic Control Tab */}
        <TabsContent value="traffic-control" className="space-y-6">
          {/* Interactive Traffic Map */}
          <TrafficMap 
            trafficLights={trafficLights}
            onTrafficLightChange={toggleTrafficLight}
            aiMode={aiMode}
          />
          
          {/* Traditional Traffic Light Control */}
          <Card>
            <CardHeader>
              <CardTitle>Main Intersection Control</CardTitle>
              <CardDescription>
                Direct control of traffic lights at the main intersection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                {/* North */}
                <div className="col-start-2 text-center">
                  <Button
                    variant="outline"
                    className="w-16 h-16 rounded-full p-0"
                    onClick={() => toggleTrafficLight("north")}
                    disabled={aiMode}
                  >
                    <div className={`w-8 h-8 rounded-full ${getTrafficLightColor(trafficLights.north)}`} />
                  </Button>
                  <p className="text-sm mt-1">North</p>
                </div>

                {/* West */}
                <div className="col-start-1 row-start-2 text-center">
                  <Button
                    variant="outline"
                    className="w-16 h-16 rounded-full p-0"
                    onClick={() => toggleTrafficLight("west")}
                    disabled={aiMode}
                  >
                    <div className={`w-8 h-8 rounded-full ${getTrafficLightColor(trafficLights.west)}`} />
                  </Button>
                  <p className="text-sm mt-1">West</p>
                </div>

                {/* Intersection */}
                <div className="col-start-2 row-start-2 flex items-center justify-center">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-xs">🚦</span>
                  </div>
                </div>

                {/* East */}
                <div className="col-start-3 row-start-2 text-center">
                  <Button
                    variant="outline"
                    className="w-16 h-16 rounded-full p-0"
                    onClick={() => toggleTrafficLight("east")}
                    disabled={aiMode}
                  >
                    <div className={`w-8 h-8 rounded-full ${getTrafficLightColor(trafficLights.east)}`} />
                  </Button>
                  <p className="text-sm mt-1">East</p>
                </div>

                {/* South */}
                <div className="col-start-2 row-start-3 text-center">
                  <Button
                    variant="outline"
                    className="w-16 h-16 rounded-full p-0"
                    onClick={() => toggleTrafficLight("south")}
                    disabled={aiMode}
                  >
                    <div className={`w-8 h-8 rounded-full ${getTrafficLightColor(trafficLights.south)}`} />
                  </Button>
                  <p className="text-sm mt-1">South</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* YOLO Detection Tab */}
        <TabsContent value="yolo-detection">
          <Card>
            <CardHeader>
              <CardTitle>YOLO Object Detection</CardTitle>
              <CardDescription>
                Real-time traffic analysis using YOLO computer vision
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Live Camera Feed</h3>
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">📹 Camera Feed Placeholder</span>
                  </div>
                  <Button className="w-full">Start YOLO Detection</Button>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Detected Objects</h3>
                  <div className="space-y-2">
                    {detectedObjects.map((obj, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Badge variant="secondary">{obj.type}</Badge>
                          <span className="font-medium">{obj.count}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {(obj.confidence * 100).toFixed(1)}% confidence
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SUMO Simulation Tab */}
        <TabsContent value="sumo-simulation">
          <Card>
            <CardHeader>
              <CardTitle>SUMO Traffic Simulation</CardTitle>
              <CardDescription>
                Simulate and analyze traffic flow patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={() => setSimulationRunning(!simulationRunning)}
                  variant={simulationRunning ? "destructive" : "default"}
                >
                  {simulationRunning ? "Stop Simulation" : "Start Simulation"}
                </Button>
                <Badge variant={simulationRunning ? "default" : "secondary"}>
                  {simulationRunning ? "Running" : "Stopped"}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Simulation View</h3>
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">🚗 SUMO Simulation Visualization</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Simulation Metrics</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Traffic Flow</span>
                        <span>75%</span>
                      </div>
                      <Progress value={75} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Average Speed</span>
                        <span>45 km/h</span>
                      </div>
                      <Progress value={60} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Queue Length</span>
                        <span>12 vehicles</span>
                      </div>
                      <Progress value={30} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Analytics</CardTitle>
              <CardDescription>
                Historical data and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,234</div>
                    <p className="text-xs text-gray-500">+12% from yesterday</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Average Wait Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2.3 min</div>
                    <p className="text-xs text-gray-500">-8% from yesterday</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">AI Efficiency</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">94%</div>
                    <p className="text-xs text-gray-500">+3% from yesterday</p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Setup Instructions</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>YOLO Integration:</strong> Install Python dependencies: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">pip install ultralytics opencv-python</code></p>
                  <p><strong>SUMO Setup:</strong> Download SUMO from <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">https://eclipse.org/sumo</code> and set SUMO_HOME environment variable</p>
                  <p><strong>WebSocket:</strong> Backend server required for real-time communication with YOLO and SUMO</p>
                  <p><strong>API Integration:</strong> Configure AI service endpoints in environment variables</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
