import React from "react";
import { Button } from "@/components/ui/button";

interface SumoVehicle {
  id: string;
  type: string;
  speed: number;
  position: { x: number; y: number };
  lane: string;
  route: string[];
}

interface TrafficMapProps {
  trafficLights: {
    north: string;
    south: string;
    east: string;
    west: string;
  };
  onTrafficLightChange: (direction: string) => void;
  aiMode: boolean;
  vehicles?: SumoVehicle[];
}

export const TrafficMap: React.FC<TrafficMapProps> = ({ trafficLights, onTrafficLightChange, aiMode, vehicles = [] }) => {
  const getTrafficLightColor = (state: string) => {
    switch (state) {
      case "red": return "bg-red-500";
      case "yellow": return "bg-yellow-500";
      case "green": return "bg-green-500";
      default: return "bg-gray-300";
    }
  };

  const getVehicleColor = (type: string) => {
    switch (type) {
      case "car": return "bg-blue-500";
      case "truck": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  const getVehiclePosition = (vehicle: SumoVehicle) => {
    // Convert SUMO coordinates to map coordinates
    const mapWidth = 256; // w-64 = 256px
    const mapHeight = 256;

    // Scale coordinates to fit the map
    const x = (vehicle.position.x / 800) * mapWidth;
    const y = (vehicle.position.y / 600) * mapHeight;

    return { x, y };
  };



  return (
    <div className="dashboard-card">
      <h3 className="text-xl font-semibold mb-4">Interactive Traffic Map</h3>
      <div className="map-wrapper">
        <div className="map-area relative w-full h-80 mx-auto overflow-hidden">
          {/* Horizontal Road */}
          <div className="absolute top-1/2 left-0 right-0 h-8 bg-gray-400 dark:bg-gray-600 transform -translate-y-1/2">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-1 bg-yellow-400"></div>
            </div>
          </div>
          {/* Vertical Road */}
          <div className="absolute left-1/2 top-0 bottom-0 w-8 bg-gray-400 dark:bg-gray-600 transform -translate-x-1/2">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-full w-1 bg-yellow-400"></div>
            </div>
          </div>
          {/* Intersection */}
          <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-gray-300 dark:bg-gray-500 transform -translate-x-1/2 -translate-y-1/2 rounded-sm"></div>

          {/* Traffic Lights */}
          {/* North */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
          <Button
              variant="outline"
              className={`w-12 h-12 rounded-full p-0 border-2 ${aiMode ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              onClick={() => !aiMode && onTrafficLightChange("north")}
              disabled={aiMode}
            >
              <div className={`w-8 h-8 rounded-full ${getTrafficLightColor(trafficLights.north)}`}></div>
            </Button>
            <p className="text-xs text-center mt-1 font-medium">North</p>
          </div>

          {/* South */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
          <Button
              variant="outline"
              className={`w-12 h-12 rounded-full p-0 border-2 ${aiMode ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              onClick={() => !aiMode && onTrafficLightChange("south")}
              disabled={aiMode}
            >
              <div className={`w-8 h-8 rounded-full ${getTrafficLightColor(trafficLights.south)}`}></div>
            </Button>
            <p className="text-xs text-center mt-1 font-medium">South</p>
          </div>

          {/* East */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <Button
              variant="outline"
              className={`w-12 h-12 rounded-full p-0 border-2 ${aiMode ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              onClick={() => !aiMode && onTrafficLightChange("east")}
              disabled={aiMode}
            >
              <div className={`w-8 h-8 rounded-full ${getTrafficLightColor(trafficLights.east)}`}></div>
            </Button>
            <p className="text-xs text-center mt-1 font-medium">East</p>
          </div>

          {/* West */}
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
          <Button
              variant="outline"
              className={`w-12 h-12 rounded-full p-0 border-2 ${aiMode ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              onClick={() => !aiMode && onTrafficLightChange("west")}
              disabled={aiMode}
            >
              <div className={`w-8 h-8 rounded-full ${getTrafficLightColor(trafficLights.west)}`}></div>
            </Button>
            <p className="text-xs text-center mt-1 font-medium">West</p>
          </div>

          {/* Vehicles */}
          {vehicles.map((vehicle) => {
            const position = getVehiclePosition(vehicle);
            return (
              <div
                key={vehicle.id}
                className={`absolute w-3 h-3 rounded-full ${getVehicleColor(vehicle.type)} border border-white shadow-sm transition-all duration-300`}
                style={{
                  left: `${position.x}px`,
                  top: `${position.y}px`,
                  transform: 'translate(-50%, -50%)',
                }}
                title={`${vehicle.type} - ${vehicle.speed.toFixed(1)} km/h`}
              />
            );
          })}
        </div>
      </div>
      {aiMode && (
        <div className="mt-4 text-center">
          <p className="text-sm text-blue-600 font-medium">🤖 AI Mode Active - Traffic lights managed automatically</p>
        </div>
      )}
    </div>
  );
};
