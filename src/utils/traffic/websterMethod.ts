/**
 * Webster's Method for Adaptive Signal Timing
 * Calculates optimal cycle length based on traffic flow
 */

export interface LaneFlow {
  laneId: string;
  saturationFlow: number;
  actualFlow: number;
  queueLength: number;
}

export interface SignalTiming {
  cycleLength: number;
  greenTime: number;
  yellowTime: number;
  redTime: number;
  allRedTime: number;
}

export class WebsterSignalController {
  private lossTime: number = 10;
  private yellowTime: number = 5;
  private allRedTime: number = 2;
  private minGreenTime: number = 10;
  private maxGreenTime: number = 90;
  private queueExtensionThreshold: number = 10;
  private queueExtensionTime: number = 10;

  /**
   * Calculate flow ratio for a lane
   */
  private calculateFlowRatio(lane: LaneFlow): number {
    if (lane.saturationFlow === 0) return 0;
    return lane.actualFlow / lane.saturationFlow;
  }

  /**
   * Calculate optimal cycle length using Webster's formula
   * Formula: Cycle_Length = (1.5 * Loss_Time + 5) / (1 - Sum_of_Flow_Ratios)
   */
  calculateCycleLength(lanes: LaneFlow[]): number {
    const sumFlowRatios = lanes.reduce(
      (sum, lane) => sum + this.calculateFlowRatio(lane),
      0
    );

    if (sumFlowRatios >= 0.9) {
      return 120;
    }

    const cycleLength =
      (1.5 * this.lossTime + 5) / (1 - Math.min(sumFlowRatios, 0.85));

    return Math.max(30, Math.min(120, cycleLength));
  }

  /**
   * Calculate green time for a specific phase
   */
  calculateGreenTime(
    cycleLength: number,
    lane: LaneFlow,
    allLanes: LaneFlow[]
  ): number {
    const flowRatio = this.calculateFlowRatio(lane);
    const sumFlowRatios = allLanes.reduce(
      (sum, l) => sum + this.calculateFlowRatio(l),
      0
    );

    if (sumFlowRatios === 0) {
      return this.minGreenTime;
    }

    const effectiveGreenTime =
      cycleLength - this.lossTime - this.yellowTime - this.allRedTime;
    let greenTime = (flowRatio / sumFlowRatios) * effectiveGreenTime;

    if (lane.queueLength > this.queueExtensionThreshold) {
      greenTime += this.queueExtensionTime;
    }

    return Math.max(
      this.minGreenTime,
      Math.min(this.maxGreenTime, greenTime)
    );
  }

  /**
   * Calculate complete signal timing for all phases
   */
  calculateSignalTiming(lanes: LaneFlow[]): SignalTiming[] {
    const cycleLength = this.calculateCycleLength(lanes);
    const timings: SignalTiming[] = [];

    for (const lane of lanes) {
      const greenTime = this.calculateGreenTime(cycleLength, lane, lanes);
      const redTime =
        cycleLength - greenTime - this.yellowTime - this.allRedTime;

      timings.push({
        cycleLength,
        greenTime: Math.round(greenTime),
        yellowTime: this.yellowTime,
        redTime: Math.round(redTime),
        allRedTime: this.allRedTime,
      });
    }

    return timings;
  }

  /**
   * Check if green extension is needed based on queue length
   */
  shouldExtendGreen(queueLength: number): boolean {
    return queueLength > this.queueExtensionThreshold;
  }

  /**
   * Calculate extended green time
   */
  calculateExtendedGreenTime(
    currentGreenTime: number,
    queueLength: number
  ): number {
    if (queueLength > this.queueExtensionThreshold) {
      const extensionMultiplier = Math.floor(
        queueLength / this.queueExtensionThreshold
      );
      const extension = extensionMultiplier * this.queueExtensionTime;
      return Math.min(
        this.maxGreenTime,
        currentGreenTime + extension
      );
    }
    return currentGreenTime;
  }

  /**
   * Get critical flow ratio (highest among all lanes)
   */
  getCriticalFlowRatio(lanes: LaneFlow[]): number {
    return Math.max(...lanes.map((lane) => this.calculateFlowRatio(lane)));
  }

  /**
   * Check if signal timing needs adjustment
   */
  needsAdjustment(lanes: LaneFlow[], currentCycleLength: number): boolean {
    const optimalCycleLength = this.calculateCycleLength(lanes);
    const difference = Math.abs(optimalCycleLength - currentCycleLength);
    return difference > 10;
  }

  /**
   * Get recommended action based on traffic conditions
   */
  getRecommendedAction(lanes: LaneFlow[]): {
    action: 'extend' | 'reduce' | 'maintain';
    reason: string;
  } {
    const criticalFlowRatio = this.getCriticalFlowRatio(lanes);
    const maxQueueLength = Math.max(...lanes.map((l) => l.queueLength));

    if (maxQueueLength > this.queueExtensionThreshold) {
      return {
        action: 'extend',
        reason: `Queue length (${maxQueueLength}) exceeds threshold`,
      };
    }

    if (criticalFlowRatio > 0.8) {
      return {
        action: 'extend',
        reason: `High flow ratio (${(criticalFlowRatio * 100).toFixed(1)}%)`,
      };
    }

    if (criticalFlowRatio < 0.3) {
      return {
        action: 'reduce',
        reason: `Low flow ratio (${(criticalFlowRatio * 100).toFixed(1)}%)`,
      };
    }

    return {
      action: 'maintain',
      reason: 'Traffic conditions are optimal',
    };
  }

  /**
   * Configure controller parameters
   */
  configure(params: {
    lossTime?: number;
    yellowTime?: number;
    allRedTime?: number;
    minGreenTime?: number;
    maxGreenTime?: number;
    queueExtensionThreshold?: number;
    queueExtensionTime?: number;
  }): void {
    if (params.lossTime !== undefined) this.lossTime = params.lossTime;
    if (params.yellowTime !== undefined) this.yellowTime = params.yellowTime;
    if (params.allRedTime !== undefined) this.allRedTime = params.allRedTime;
    if (params.minGreenTime !== undefined)
      this.minGreenTime = params.minGreenTime;
    if (params.maxGreenTime !== undefined)
      this.maxGreenTime = params.maxGreenTime;
    if (params.queueExtensionThreshold !== undefined)
      this.queueExtensionThreshold = params.queueExtensionThreshold;
    if (params.queueExtensionTime !== undefined)
      this.queueExtensionTime = params.queueExtensionTime;
  }
}
