/**
 * DeepSORT Vehicle Tracking Logic
 * Assigns unique IDs to vehicles and prevents double-counting
 */

export interface TrackedVehicle {
  id: string;
  type: 'Heavy' | 'Medium' | 'Light';
  position: { x: number; y: number };
  velocity: { vx: number; vy: number };
  lastSeen: number;
  frameCount: number;
  pcu: number;
}

export interface DetectedVehicle {
  bbox: { x: number; y: number; width: number; height: number };
  confidence: number;
  class: string;
}

export class DeepSORTTracker {
  private tracks: Map<string, TrackedVehicle> = new Map();
  private nextId: number = 1;
  private maxAge: number = 30;
  private minHits: number = 3;
  private iouThreshold: number = 0.3;

  /**
   * Calculate Intersection over Union (IoU) between two bounding boxes
   */
  private calculateIoU(
    box1: { x: number; y: number; width: number; height: number },
    box2: { x: number; y: number; width: number; height: number }
  ): number {
    const x1 = Math.max(box1.x, box2.x);
    const y1 = Math.max(box1.y, box2.y);
    const x2 = Math.min(box1.x + box1.width, box2.x + box2.width);
    const y2 = Math.min(box1.y + box1.height, box2.y + box2.height);

    const intersection = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
    const area1 = box1.width * box1.height;
    const area2 = box2.width * box2.height;
    const union = area1 + area2 - intersection;

    return union > 0 ? intersection / union : 0;
  }

  /**
   * Classify vehicle type and calculate PCU (Passenger Car Unit)
   */
  private classifyVehicle(vehicleClass: string): {
    type: 'Heavy' | 'Medium' | 'Light';
    pcu: number;
  } {
    const lowerClass = vehicleClass.toLowerCase();

    if (lowerClass.includes('bus') || lowerClass.includes('truck')) {
      return { type: 'Heavy', pcu: 3.0 };
    } else if (lowerClass.includes('car') || lowerClass.includes('van')) {
      return { type: 'Medium', pcu: 1.0 };
    } else if (
      lowerClass.includes('bike') ||
      lowerClass.includes('motorcycle') ||
      lowerClass.includes('bicycle')
    ) {
      return { type: 'Light', pcu: 0.5 };
    }

    return { type: 'Medium', pcu: 1.0 };
  }

  /**
   * Update tracks with new detections
   */
  update(detections: DetectedVehicle[]): TrackedVehicle[] {
    const currentTime = Date.now();
    const updatedTracks: TrackedVehicle[] = [];

    const unmatchedDetections = [...detections];
    const unmatchedTracks = new Set(this.tracks.keys());

    for (const detection of detections) {
      let bestMatch: { id: string; iou: number } | null = null;

      for (const [id, track] of this.tracks.entries()) {
        const trackBox = {
          x: track.position.x - 25,
          y: track.position.y - 25,
          width: 50,
          height: 50,
        };

        const iou = this.calculateIoU(detection.bbox, trackBox);

        if (iou > this.iouThreshold && (!bestMatch || iou > bestMatch.iou)) {
          bestMatch = { id, iou };
        }
      }

      if (bestMatch) {
        const track = this.tracks.get(bestMatch.id)!;
        const centerX = detection.bbox.x + detection.bbox.width / 2;
        const centerY = detection.bbox.y + detection.bbox.height / 2;

        const vx = centerX - track.position.x;
        const vy = centerY - track.position.y;

        track.position = { x: centerX, y: centerY };
        track.velocity = { vx, vy };
        track.lastSeen = currentTime;
        track.frameCount++;

        unmatchedTracks.delete(bestMatch.id);
        const index = unmatchedDetections.indexOf(detection);
        if (index > -1) {
          unmatchedDetections.splice(index, 1);
        }

        if (track.frameCount >= this.minHits) {
          updatedTracks.push(track);
        }
      }
    }

    for (const detection of unmatchedDetections) {
      const id = `V${this.nextId++}`;
      const centerX = detection.bbox.x + detection.bbox.width / 2;
      const centerY = detection.bbox.y + detection.bbox.height / 2;
      const classification = this.classifyVehicle(detection.class);

      const newTrack: TrackedVehicle = {
        id,
        type: classification.type,
        position: { x: centerX, y: centerY },
        velocity: { vx: 0, vy: 0 },
        lastSeen: currentTime,
        frameCount: 1,
        pcu: classification.pcu,
      };

      this.tracks.set(id, newTrack);
    }

    for (const id of unmatchedTracks) {
      const track = this.tracks.get(id)!;
      const age = currentTime - track.lastSeen;

      if (age > this.maxAge * 1000) {
        this.tracks.delete(id);
      }
    }

    return updatedTracks;
  }

  /**
   * Get all active tracks
   */
  getTracks(): TrackedVehicle[] {
    return Array.from(this.tracks.values()).filter(
      (track) => track.frameCount >= this.minHits
    );
  }

  /**
   * Get total PCU count
   */
  getTotalPCU(): number {
    return this.getTracks().reduce((sum, track) => sum + track.pcu, 0);
  }

  /**
   * Get vehicle count by type
   */
  getCountByType(): { Heavy: number; Medium: number; Light: number } {
    const tracks = this.getTracks();
    return {
      Heavy: tracks.filter((t) => t.type === 'Heavy').length,
      Medium: tracks.filter((t) => t.type === 'Medium').length,
      Light: tracks.filter((t) => t.type === 'Light').length,
    };
  }

  /**
   * Reset tracker
   */
  reset(): void {
    this.tracks.clear();
    this.nextId = 1;
  }
}
