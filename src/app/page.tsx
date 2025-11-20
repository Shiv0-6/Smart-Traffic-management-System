"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrafficMap } from "@/components/ui/traffic-map";
import { Footer } from "@/components/footer";
import { useYolo } from "@/hooks/use-yolo";
import { useSumo } from "@/hooks/use-sumo";
import SumoCanvas from "@/components/sumo-canvas";

export default function TrafficManagementSystem() {
  const [aiMode, setAiMode] = useState(false);
  const [trafficLights, setTrafficLights] = useState({
    north: "red",
    south: "red",
    east: "green",
    west: "green"
  });
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [detectionRunning, setDetectionRunning] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // YOLO hook
  const {
    isLoading,
    detectedObjects,
    error,
    isModelLoaded,
    startContinuousDetection,
    clearDetections
  } = useYolo();

  // SUMO hook
  const {
    isConnected,
    isRunning,
    currentStep,
    vehicles,
    trafficLights: sumoTrafficLights,
    metrics,
    startSimulation,
    stopSimulation,
    resetSimulation,
    error: sumoError
  } = useSumo();

  // Handle video stream lifecycle
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

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
    <div className="min-h-screen">
      <div className="header-bar">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          <h1 className="header-title">Smart Traffic Management System</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="section-panel">
          <div className="panel-header">
            <div>
              <div className="panel-title">Traffic Dashboard</div>
              <div className="text-sm text-gray-500">Overview of live traffic and simulation</div>
            </div>
            <div>
              <button className="modern-button">Explore Features</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="metric-card">
              <div className="card-icon" aria-hidden>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 13l1.5-4.5A2 2 0 017.5 6h9a2 2 0 011.9 1.5L20 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="7.5" cy="17.5" r="1.5" fill="currentColor"/>
                  <circle cx="16.5" cy="17.5" r="1.5" fill="currentColor"/>
                </svg>
              </div>
              <div>
                <div className="card-title">Total Vehicles Detected</div>
                <div className="card-value">{metrics?.totalVehicles || 1234}</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="card-icon" aria-hidden>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6h13v13l-3-2-3 2-3-2-3 2V6z" stroke="currentColor" strokeWidth="1.2" fill="none" />
                </svg>
              </div>
              <div>
                <div className="card-title">Average Speed</div>
                <div className="card-value text-green-600">{Math.round(metrics?.averageSpeed || 45)} km/h</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="card-icon" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2 L2 22h20L12 2z" stroke="currentColor" strokeWidth="1.4" fill="none" />
                  <path d="M12 8v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <circle cx="12" cy="17" r="1" fill="currentColor" />
                </svg>
              </div>
              <div>
                <div className="card-title">Violations Today</div>
                <div className="card-value text-red-600">{(isLoading ? 0 : detectedObjects.length) || 12}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="mb-3 font-semibold">Real-Time Traffic Map</div>
              <div className="map-container">
                <TrafficMap
                  trafficLights={{ north: 'red', south: 'red', east: 'green', west: 'green' }}
                  onTrafficLightChange={() => {}}
                  aiMode={false}
                  vehicles={vehicles}
                />
              </div>
            </div>

            <div>
              <div className="mb-3 font-semibold">SUMO Visualization</div>
                <div className="sumo-placeholder" style={{height:320}}>
                  <div style={{width:'100%', height:'100%'}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 12px'}}>
                      <div style={{color:'#cbd5e1', fontSize:13}}>Step: <strong style={{color:'white'}}>{currentStep}</strong></div>
                      <div style={{color:'#94a3b8', fontSize:13}}>Updated: <strong style={{color:'white'}}>{new Date().toLocaleTimeString()}</strong></div>
                    </div>
                    <SumoCanvas vehicles={vehicles} />
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
