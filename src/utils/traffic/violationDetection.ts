/**
 * Violation Detection using Geofencing
 * Implements Red Light Violation Detection (RLVD) and Wrong Way Detection
 */

import * as geoUtils from './geoUtils';

export interface StopLine {
  id: string;
  coordinates: [number, number][];
}

export interface Vehicle {
  id: string;
  position: [number, number];
  bearing: number;
}

export interface Lane {
  id: string;
  direction: number;
  stopLine: StopLine;
}

export interface Violation {
  id: string;
  type: 'red_light' | 'wrong_way';
  vehicleId: string;
  location: [number, number];
  timestamp: number;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export class ViolationDetector {
  private violations: Map<string, Violation> = new Map();
  private violationIdCounter: number = 1;
  private wrongWayThreshold: number = 160;

  /**
   * Check if a vehicle crosses a stop line
   */
  private crossesStopLine(
    vehiclePosition: [number, number],
    stopLine: StopLine
  ): boolean {
    try {
      const point = geoUtils.point(vehiclePosition);
      const line = geoUtils.lineString(stopLine.coordinates);
      
      // Calculate distance to stop line
      const distance = geoUtils.pointToLineDistance(point, line, 'meters');
      
      // Vehicle crossed if within 2 meters past the line
      return distance < 2;
    } catch (error) {
      console.error('Error checking stop line crossing:', error);
      return false;
    }
  }

  /**
   * Detect Red Light Violation
   * Triggers when signal is RED and vehicle crosses stop line
   */
  detectRedLightViolation(
    vehicle: Vehicle,
    lane: Lane,
    signalState: 'red' | 'yellow' | 'green'
  ): Violation | null {
    if (signalState !== 'red') {
      return null;
    }

    if (this.crossesStopLine(vehicle.position, lane.stopLine)) {
      const violationId = `RLV${this.violationIdCounter++}`;
      const violation: Violation = {
        id: violationId,
        type: 'red_light',
        vehicleId: vehicle.id,
        location: vehicle.position,
        timestamp: Date.now(),
        severity: 'high',
        description: `Vehicle ${vehicle.id} crossed stop line at ${lane.id} during red signal`,
      };

      this.violations.set(violationId, violation);
      return violation;
    }

    return null;
  }

  /**
   * Detect Wrong Way Driving
   * Uses Turf.bearing to compare vehicle direction vs. lane direction
   */
  detectWrongWay(vehicle: Vehicle, lane: Lane): Violation | null {
    try {
      const bearingDiff = Math.abs(vehicle.bearing - lane.direction);
      const normalizedDiff = Math.min(bearingDiff, 360 - bearingDiff);

      if (normalizedDiff > this.wrongWayThreshold) {
        const violationId = `WWV${this.violationIdCounter++}`;
        const violation: Violation = {
          id: violationId,
          type: 'wrong_way',
          vehicleId: vehicle.id,
          location: vehicle.position,
          timestamp: Date.now(),
          severity: 'high',
          description: `Vehicle ${vehicle.id} traveling in wrong direction on ${lane.id} (${normalizedDiff.toFixed(1)}° difference)`,
        };

        this.violations.set(violationId, violation);
        return violation;
      }

      return null;
    } catch (error) {
      console.error('Error detecting wrong way:', error);
      return null;
    }
  }

  /**
   * Calculate bearing between two points using Turf.js
   */
  calculateBearing(
    from: [number, number],
    to: [number, number]
  ): number {
    try {
      const point1 = geoUtils.point(from);
      const point2 = geoUtils.point(to);
      return geoUtils.bearing(point1, point2);
    } catch (error) {
      console.error('Error calculating bearing:', error);
      return 0;
    }
  }

  /**
   * Check if a point is within a geofence
   */
  isWithinGeofence(
    point: [number, number],
    geofence: [number, number][]
  ): boolean {
    try {
      const pt = geoUtils.point(point);
      const polygon = geofence.map(coord => geoUtils.point(coord));
      return geoUtils.booleanPointInPolygon(pt, polygon);
    } catch (error) {
      console.error('Error checking geofence:', error);
      return false;
    }
  }

  /**
   * Calculate distance from point to line (stop line)
   */
  distanceToStopLine(
    vehiclePosition: [number, number],
    stopLine: StopLine
  ): number {
    try {
      const point = geoUtils.point(vehiclePosition);
      const line = geoUtils.lineString(stopLine.coordinates);
      return geoUtils.pointToLineDistance(point, line, 'meters');
    } catch (error) {
      console.error('Error calculating distance to stop line:', error);
      return Infinity;
    }
  }

  /**
   * Get all violations
   */
  getViolations(): Violation[] {
    return Array.from(this.violations.values());
  }

  /**
   * Get violations by type
   */
  getViolationsByType(type: 'red_light' | 'wrong_way'): Violation[] {
    return this.getViolations().filter((v) => v.type === type);
  }

  /**
   * Get violations by vehicle ID
   */
  getViolationsByVehicle(vehicleId: string): Violation[] {
    return this.getViolations().filter((v) => v.vehicleId === vehicleId);
  }

  /**
   * Get violation statistics
   */
  getStatistics(): {
    total: number;
    redLight: number;
    wrongWay: number;
    bySeverity: { low: number; medium: number; high: number };
  } {
    const violations = this.getViolations();
    return {
      total: violations.length,
      redLight: violations.filter((v) => v.type === 'red_light').length,
      wrongWay: violations.filter((v) => v.type === 'wrong_way').length,
      bySeverity: {
        low: violations.filter((v) => v.severity === 'low').length,
        medium: violations.filter((v) => v.severity === 'medium').length,
        high: violations.filter((v) => v.severity === 'high').length,
      },
    };
  }

  /**
   * Clear old violations (older than specified time)
   */
  clearOldViolations(maxAge: number = 3600000): void {
    const now = Date.now();
    for (const [id, violation] of this.violations.entries()) {
      if (now - violation.timestamp > maxAge) {
        this.violations.delete(id);
      }
    }
  }

  /**
   * Reset all violations
   */
  reset(): void {
    this.violations.clear();
    this.violationIdCounter = 1;
  }

  /**
   * Configure detector parameters
   */
  configure(params: { wrongWayThreshold?: number }): void {
    if (params.wrongWayThreshold !== undefined) {
      this.wrongWayThreshold = params.wrongWayThreshold;
    }
  }
}
