import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, AlertTriangle } from 'lucide-react';
import type { TrafficSignal } from '@/types/types';

interface LeafletTrafficMapProps {
  signals?: TrafficSignal[];
  center?: [number, number];
  zoom?: number;
  showTrafficLayer?: boolean;
}

// Prefer env-configured default center; fall back to a sensible non-NY default.
const envCenter = (() => {
  const raw = import.meta.env.VITE_MAP_DEFAULT_CENTER as string | undefined;
  if (!raw) return null;
  const parts = raw.split(',').map((p) => parseFloat(p.trim()));
  return parts.length === 2 && parts.every(Number.isFinite)
    ? ([parts[0], parts[1]] as [number, number])
    : null;
})();

const defaultCenter: [number, number] = envCenter ?? [28.6139, 77.209]; // Default to New Delhi if not provided

const LeafletTrafficMap: React.FC<LeafletTrafficMapProps> = ({
  signals = [],
  center = defaultCenter,
  zoom = 13,
  showTrafficLayer = true,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [selectedSignal, setSelectedSignal] = useState<TrafficSignal | null>(
    null
  );

  const parseLocation = (location: string): [number, number] => {
    const match = location.match(/\((-?\d+\.?\d*),\s*(-?\d+\.?\d*)\)/);
    if (match) {
      return [parseFloat(match[1]), parseFloat(match[2])];
    }
    return center;
  };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView(center, zoom);

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20,
      }
    ).addTo(map);

    if (showTrafficLayer) {
      const tomtomApiKey = 'YOUR_TOMTOM_API_KEY';
      if (tomtomApiKey && tomtomApiKey !== 'YOUR_TOMTOM_API_KEY') {
        L.tileLayer(
          `https://api.tomtom.com/traffic/map/4/tile/flow/relative/{z}/{x}/{y}.png?key=${tomtomApiKey}`,
          {
            attribution: '&copy; TomTom',
            opacity: 0.6,
            maxZoom: 18,
          }
        ).addTo(map);
      }
    }

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom, showTrafficLayer]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    signals.forEach((signal) => {
      const iconColor =
        signal.status === 'green'
          ? '#10b981'
          : signal.status === 'yellow'
            ? '#f59e0b'
            : '#ef4444';

      const icon = L.divIcon({
        className: 'custom-signal-marker',
        html: `
          <div style="
            background-color: ${iconColor};
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              width: 12px;
              height: 12px;
              background-color: white;
              border-radius: 50%;
              animation: pulse 2s infinite;
            "></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker(parseLocation(signal.location), { icon })
        .addTo(mapInstanceRef.current!)
        .bindPopup(
          `
          <div style="color: #1f2937; padding: 8px;">
            <strong>${signal.location}</strong><br/>
            Status: <span style="color: ${iconColor}; font-weight: bold;">${signal.status.toUpperCase()}</span><br/>
            Mode: ${signal.mode.toUpperCase()}
          </div>
        `
        )
        .on('click', () => {
          setSelectedSignal(signal);
        });

      markersRef.current.push(marker);
    });
  }, [signals]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(center, zoom);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Live Traffic Map
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-background/50">
                <Navigation className="h-3 w-3 mr-1" />
                OpenStreetMap
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRecenter}
                className="h-8"
              >
                <Navigation className="h-4 w-4 mr-1" />
                Recenter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div
            ref={mapRef}
            className="w-full h-[500px] rounded-lg overflow-hidden border border-border"
          />

          <div className="mt-4 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Green Signal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span>Yellow Signal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span>Red Signal</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedSignal && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Signal Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span className="font-medium">{selectedSignal.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge
                  className={
                    selectedSignal.status === 'green'
                      ? 'bg-green-500'
                      : selectedSignal.status === 'yellow'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  }
                >
                  {selectedSignal.status.toUpperCase()}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mode:</span>
                <Badge variant="outline">{selectedSignal.mode.toUpperCase()}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default LeafletTrafficMap;
