/**
 * Geospatial Utility Functions
 * Lightweight implementations of common geospatial calculations
 * Replaces @turf/turf dependency
 */

export interface Point {
  lat: number;
  lng: number;
}

export interface LineString {
  coordinates: [number, number][];
}

/**
 * Calculate bearing between two points
 * @param start Starting point [lat, lng]
 * @param end Ending point [lat, lng]
 * @returns Bearing in degrees (0-360)
 */
export function bearing(start: Point, end: Point): number {
  const lat1 = toRadians(start.lat);
  const lat2 = toRadians(end.lat);
  const dLng = toRadians(end.lng - start.lng);

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) -
            Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  const bearingRad = Math.atan2(y, x);
  const bearingDeg = toDegrees(bearingRad);

  return (bearingDeg + 360) % 360;
}

/**
 * Calculate distance between two points using Haversine formula
 * @param from Starting point
 * @param to Ending point
 * @param units Distance units ('meters' or 'kilometers')
 * @returns Distance in specified units
 */
export function distance(
  from: Point,
  to: Point,
  units: 'meters' | 'kilometers' = 'kilometers'
): number {
  const R = 6371; // Earth's radius in kilometers
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distKm = R * c;

  return units === 'meters' ? distKm * 1000 : distKm;
}

/**
 * Calculate distance from a point to a line
 * @param point Point to measure from
 * @param line Line defined by array of coordinates
 * @param units Distance units
 * @returns Minimum distance to line
 */
export function pointToLineDistance(
  point: Point,
  line: LineString,
  units: 'meters' | 'kilometers' = 'meters'
): number {
  let minDistance = Infinity;

  for (let i = 0; i < line.coordinates.length - 1; i++) {
    const start: Point = { lat: line.coordinates[i][0], lng: line.coordinates[i][1] };
    const end: Point = { lat: line.coordinates[i + 1][0], lng: line.coordinates[i + 1][1] };

    const dist = pointToSegmentDistance(point, start, end);
    minDistance = Math.min(minDistance, dist);
  }

  return units === 'meters' ? minDistance * 1000 : minDistance;
}

/**
 * Calculate distance from point to line segment
 * @param point Point to measure from
 * @param start Start of line segment
 * @param end End of line segment
 * @returns Distance in kilometers
 */
function pointToSegmentDistance(point: Point, start: Point, end: Point): number {
  const x0 = point.lat;
  const y0 = point.lng;
  const x1 = start.lat;
  const y1 = start.lng;
  const x2 = end.lat;
  const y2 = end.lng;

  const A = x0 - x1;
  const B = y0 - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;

  if (lenSq !== 0) {
    param = dot / lenSq;
  }

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = x0 - xx;
  const dy = y0 - yy;

  return Math.sqrt(dx * dx + dy * dy) * 111; // Approximate km per degree
}

/**
 * Check if a point is inside a polygon
 * @param point Point to check
 * @param polygon Array of points defining the polygon
 * @returns True if point is inside polygon
 */
export function booleanPointInPolygon(point: Point, polygon: Point[]): boolean {
  let inside = false;
  const x = point.lat;
  const y = point.lng;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lat;
    const yi = polygon[i].lng;
    const xj = polygon[j].lat;
    const yj = polygon[j].lng;

    const intersect = ((yi > y) !== (yj > y)) &&
                     (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

    if (intersect) inside = !inside;
  }

  return inside;
}

/**
 * Create a point object
 * @param coordinates [lat, lng]
 * @returns Point object
 */
export function point(coordinates: [number, number]): Point {
  return { lat: coordinates[0], lng: coordinates[1] };
}

/**
 * Create a line string object
 * @param coordinates Array of [lat, lng] pairs
 * @returns LineString object
 */
export function lineString(coordinates: [number, number][]): LineString {
  return { coordinates };
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * Math.PI / 180;
}

/**
 * Convert radians to degrees
 */
function toDegrees(radians: number): number {
  return radians * 180 / Math.PI;
}

/**
 * Calculate the center point of multiple points
 * @param points Array of points
 * @returns Center point
 */
export function center(points: Point[]): Point {
  const sum = points.reduce(
    (acc, p) => ({ lat: acc.lat + p.lat, lng: acc.lng + p.lng }),
    { lat: 0, lng: 0 }
  );

  return {
    lat: sum.lat / points.length,
    lng: sum.lng / points.length
  };
}

/**
 * Create a buffer around a point
 * @param point Center point
 * @param radius Radius in kilometers
 * @param steps Number of points in the circle
 * @returns Array of points forming a circle
 */
export function buffer(point: Point, radius: number, steps: number = 32): Point[] {
  const points: Point[] = [];
  const R = 6371; // Earth's radius in km

  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * 2 * Math.PI;
    const dx = radius * Math.cos(angle);
    const dy = radius * Math.sin(angle);

    const lat = point.lat + (dy / R) * (180 / Math.PI);
    const lng = point.lng + (dx / R) * (180 / Math.PI) / Math.cos(point.lat * Math.PI / 180);

    points.push({ lat, lng });
  }

  return points;
}
