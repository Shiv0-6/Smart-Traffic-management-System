import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';
import type { TrafficSignal, TrafficFlow } from '@/types/types';

interface TrafficMapProps {
  signals: TrafficSignal[];
  flowData: TrafficFlow[];
  className?: string;
}

export const TrafficMap: React.FC<TrafficMapProps> = ({ signals, flowData, className }) => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const locations = [
    { name: 'Main St & 1st Ave', x: 25, y: 30 },
    { name: 'Main St & 2nd Ave', x: 65, y: 30 },
    { name: 'Oak St & 1st Ave', x: 25, y: 70 },
    { name: 'Oak St & 2nd Ave', x: 65, y: 70 },
  ];

  const getSignalColor = (location: string) => {
    const signal = signals.find(s => s.location === location);
    if (!signal) return 'bg-muted';
    
    switch (signal.status.toLowerCase()) {
      case 'green':
        return 'traffic-light-green';
      case 'yellow':
        return 'traffic-light-yellow';
      case 'red':
        return 'traffic-light-red';
      default:
        return 'bg-muted';
    }
  };

  const getCongestionColor = (location: string) => {
    const flow = flowData.find(f => f.location === location);
    if (!flow) return 'rgba(100, 100, 100, 0.2)';
    
    switch (flow.congestion_level?.toLowerCase()) {
      case 'low':
        return 'rgba(34, 197, 94, 0.2)';
      case 'medium':
        return 'rgba(234, 179, 8, 0.3)';
      case 'high':
        return 'rgba(239, 68, 68, 0.4)';
      default:
        return 'rgba(100, 100, 100, 0.2)';
    }
  };

  const getLocationData = (location: string) => {
    const signal = signals.find(s => s.location === location);
    const flow = flowData.find(f => f.location === location);
    return { signal, flow };
  };

  return (
    <div className={`relative w-full h-full min-h-[500px] bg-card border rounded-lg overflow-hidden ${className}`}>
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="hsl(var(--border))" strokeWidth="0.2" opacity="0.3"/>
          </pattern>
        </defs>
        
        <rect width="100" height="100" fill="url(#grid)" />
        
        <line x1="25" y1="0" x2="25" y2="100" stroke="hsl(var(--muted-foreground))" strokeWidth="0.8" opacity="0.5" />
        <line x1="65" y1="0" x2="65" y2="100" stroke="hsl(var(--muted-foreground))" strokeWidth="0.8" opacity="0.5" />
        <line x1="0" y1="30" x2="100" y2="30" stroke="hsl(var(--muted-foreground))" strokeWidth="0.8" opacity="0.5" />
        <line x1="0" y1="70" x2="100" y2="70" stroke="hsl(var(--muted-foreground))" strokeWidth="0.8" opacity="0.5" />
        
        {locations.map((loc, idx) => {
          const { signal, flow } = getLocationData(loc.name);
          return (
            <g key={idx}>
              <circle
                cx={loc.x}
                cy={loc.y}
                r="12"
                fill={getCongestionColor(loc.name)}
                stroke="hsl(var(--border))"
                strokeWidth="0.5"
                className="transition-all duration-300"
              />
              
              <circle
                cx={loc.x}
                cy={loc.y}
                r="3"
                className={`${getSignalColor(loc.name)} animate-pulse cursor-pointer transition-all duration-300`}
                onClick={() => setSelectedLocation(selectedLocation === loc.name ? null : loc.name)}
              />
              
              {flow && flow.vehicle_count && flow.vehicle_count > 0 && (
                <>
                  {[...Array(Math.min(3, Math.floor(flow.vehicle_count / 20)))].map((_, i) => (
                    <circle
                      key={i}
                      cx={loc.x + (i - 1) * 4}
                      cy={loc.y - 8}
                      r="1"
                      fill="hsl(var(--primary))"
                      className="animate-pulse-slow"
                      style={{ animationDelay: `${i * 0.3}s` }}
                    />
                  ))}
                </>
              )}
            </g>
          );
        })}
        
        <text x="25" y="8" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="3" fontWeight="bold">
          Main St
        </text>
        <text x="65" y="8" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="3" fontWeight="bold">
          Main St
        </text>
        <text x="5" y="32" fill="hsl(var(--muted-foreground))" fontSize="3" fontWeight="bold">
          1st Ave
        </text>
        <text x="5" y="72" fill="hsl(var(--muted-foreground))" fontSize="3" fontWeight="bold">
          2nd Ave
        </text>
      </svg>

      <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm border rounded-lg p-3 space-y-2">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded-full traffic-light-green"></div>
          <span>Green</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded-full traffic-light-yellow"></div>
          <span>Yellow</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded-full traffic-light-red"></div>
          <span>Red</span>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(34, 197, 94, 0.3)' }}></div>
            <span>Low Traffic</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(234, 179, 8, 0.3)' }}></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(239, 68, 68, 0.4)' }}></div>
            <span>High</span>
          </div>
        </div>
      </div>

      {selectedLocation && (
        <div className="absolute bottom-4 left-4 right-4 bg-card/95 backdrop-blur-sm border rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-semibold">{selectedLocation}</span>
            </div>
            <button
              onClick={() => setSelectedLocation(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>
          {(() => {
            const { signal, flow } = getLocationData(selectedLocation);
            return (
              <div className="grid grid-cols-2 gap-3 text-sm">
                {signal && (
                  <>
                    <div>
                      <p className="text-muted-foreground text-xs">Signal Status</p>
                      <Badge variant="outline" className="mt-1">
                        {signal.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Mode</p>
                      <Badge variant="secondary" className="mt-1">
                        {signal.mode}
                      </Badge>
                    </div>
                  </>
                )}
                {flow && (
                  <>
                    <div>
                      <p className="text-muted-foreground text-xs">Vehicles</p>
                      <p className="font-semibold">{flow.vehicle_count || 0}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Avg Speed</p>
                      <p className="font-semibold">{flow.avg_speed || 0} km/h</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground text-xs">Congestion</p>
                      <Badge 
                        variant="outline" 
                        className={`mt-1 ${
                          flow.congestion_level === 'low' ? 'text-success' :
                          flow.congestion_level === 'medium' ? 'text-warning' :
                          flow.congestion_level === 'high' ? 'text-destructive' : ''
                        }`}
                      >
                        {flow.congestion_level?.toUpperCase() || 'N/A'}
                      </Badge>
                    </div>
                  </>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
