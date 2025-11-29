import React, { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Navigation, AlertCircle, Clock, TrendingUp } from 'lucide-react';
import type { TrafficSignal } from '@/types/types';

interface GoogleTrafficMapProps {
  signals: TrafficSignal[];
  className?: string;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export const GoogleTrafficMap: React.FC<GoogleTrafficMapProps> = ({ signals, className }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [trafficLayer, setTrafficLayer] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [showTraffic, setShowTraffic] = useState(true);
  const [selectedSignal, setSelectedSignal] = useState<TrafficSignal | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const locations = [
    { name: 'Main St & 1st Ave', lat: 40.7580, lng: -73.9855 },
    { name: 'Main St & 2nd Ave', lat: 40.7590, lng: -73.9845 },
    { name: 'Oak St & 1st Ave', lat: 40.7570, lng: -73.9865 },
    { name: 'Oak St & 2nd Ave', lat: 40.7560, lng: -73.9875 },
  ];

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.warn('Google Maps API key not found. Using demo mode.');
      setMapLoaded(false);
      return;
    }

    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setMapLoaded(true);
      initializeMap();
    };
    script.onerror = () => {
      console.error('Failed to load Google Maps');
      setMapLoaded(false);
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (map && mapLoaded) {
      updateMarkers();
    }
  }, [signals, map, mapLoaded]);

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: { lat: 40.7575, lng: -73.9860 },
      zoom: 16,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      styles: [
        {
          featureType: 'all',
          elementType: 'geometry',
          stylers: [{ color: '#1a2332' }]
        },
        {
          featureType: 'all',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#8ec3b9' }]
        },
        {
          featureType: 'all',
          elementType: 'labels.text.stroke',
          stylers: [{ color: '#1a2332' }]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{ color: '#2c3e50' }]
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#1a2332' }]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#0e1626' }]
        }
      ]
    });

    const traffic = new window.google.maps.TrafficLayer();
    traffic.setMap(mapInstance);

    setMap(mapInstance);
    setTrafficLayer(traffic);
  };

  const updateMarkers = () => {
    if (!map || !window.google) return;

    markers.forEach(marker => marker.setMap(null));

    const newMarkers = locations.map((location) => {
      const signal = signals.find(s => s.location === location.name);
      const markerColor = signal ? getMarkerColor(signal.status) : '#6B7280';

      const marker = new window.google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: map,
        title: location.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: markerColor,
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          scale: 10,
        },
        animation: window.google.maps.Animation.DROP,
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: createInfoWindowContent(location.name, signal),
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
        setSelectedSignal(signal || null);
      });

      return marker;
    });

    setMarkers(newMarkers);
  };

  const getMarkerColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'green':
        return '#22c55e';
      case 'yellow':
        return '#eab308';
      case 'red':
        return '#ef4444';
      default:
        return '#6B7280';
    }
  };

  const createInfoWindowContent = (locationName: string, signal?: TrafficSignal) => {
    return `
      <div style="padding: 8px; min-width: 200px; color: #1a2332;">
        <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">${locationName}</h3>
        ${signal ? `
          <div style="margin-bottom: 4px;">
            <strong>Status:</strong> <span style="color: ${getMarkerColor(signal.status)}; font-weight: 600;">${signal.status.toUpperCase()}</span>
          </div>
          <div style="margin-bottom: 4px;">
            <strong>Mode:</strong> ${signal.mode}
          </div>
          ${signal.timing_config ? `
            <div style="margin-top: 8px; font-size: 12px;">
              <div>🔴 Red: ${signal.timing_config.red}s</div>
              <div>🟡 Yellow: ${signal.timing_config.yellow}s</div>
              <div>🟢 Green: ${signal.timing_config.green}s</div>
            </div>
          ` : ''}
        ` : '<div style="color: #6B7280;">No signal data available</div>'}
      </div>
    `;
  };

  const toggleTrafficLayer = () => {
    if (trafficLayer && map) {
      if (showTraffic) {
        trafficLayer.setMap(null);
      } else {
        trafficLayer.setMap(map);
      }
      setShowTraffic(!showTraffic);
    }
  };

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <Card className="p-8 text-center border-warning/20">
        <AlertCircle className="h-12 w-12 mx-auto text-warning mb-4" />
        <h3 className="text-lg font-semibold mb-2">Google Maps API Key Required</h3>
        <p className="text-sm text-muted-foreground mb-4">
          To enable real-time traffic data and advanced mapping features, please add your Google Maps API key.
        </p>
        <div className="bg-muted/50 p-4 rounded-lg text-left text-xs font-mono mb-4">
          <p className="mb-2">1. Get API key from: <a href="https://console.cloud.google.com/google/maps-apis" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Cloud Console</a></p>
          <p className="mb-2">2. Enable Maps JavaScript API</p>
          <p>3. Add to .env file:</p>
          <code className="block mt-2 p-2 bg-background rounded">
            VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
          </code>
        </div>
        <div className="grid grid-cols-2 gap-4 text-left text-sm">
          <div className="p-3 bg-primary/10 rounded-lg">
            <MapPin className="h-5 w-5 text-primary mb-2" />
            <p className="font-medium">Real-time Traffic</p>
            <p className="text-xs text-muted-foreground">Live traffic conditions</p>
          </div>
          <div className="p-3 bg-accent/10 rounded-lg">
            <Navigation className="h-5 w-5 text-accent mb-2" />
            <p className="font-medium">Route Planning</p>
            <p className="text-xs text-muted-foreground">Optimal path finding</p>
          </div>
          <div className="p-3 bg-success/10 rounded-lg">
            <Clock className="h-5 w-5 text-success mb-2" />
            <p className="font-medium">ETA Calculation</p>
            <p className="text-xs text-muted-foreground">Accurate time estimates</p>
          </div>
          <div className="p-3 bg-warning/10 rounded-lg">
            <TrendingUp className="h-5 w-5 text-warning mb-2" />
            <p className="font-medium">Traffic Predictions</p>
            <p className="text-xs text-muted-foreground">Future traffic patterns</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mapRef} 
        className="w-full h-full min-h-[500px] rounded-lg overflow-hidden border border-border"
      />
      
      <div className="absolute top-4 right-4 space-y-2">
        <Button
          size="sm"
          variant={showTraffic ? "default" : "outline"}
          onClick={toggleTrafficLayer}
          className="shadow-lg"
        >
          {showTraffic ? 'Hide' : 'Show'} Traffic
        </Button>
      </div>

      <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success"></div>
            <span>Green Signal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning"></div>
            <span>Yellow Signal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive"></div>
            <span>Red Signal</span>
          </div>
          <div className="border-t pt-2 mt-2 text-muted-foreground">
            <p>Click markers for details</p>
          </div>
        </div>
      </div>

      {selectedSignal && (
        <div className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm border rounded-lg p-4 shadow-lg max-w-xs">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm">{selectedSignal.location}</h4>
            <button
              onClick={() => setSelectedSignal(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <Badge variant="outline">{selectedSignal.status.toUpperCase()}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mode:</span>
              <Badge variant="secondary">{selectedSignal.mode}</Badge>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
