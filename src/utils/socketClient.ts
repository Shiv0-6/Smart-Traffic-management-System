/**
 * Socket.io Client for Real-time Traffic Updates
 * Listens for traffic_update and violation_alert events
 */

import { io, Socket } from 'socket.io-client';
import type { TrafficFlow, TrafficSignal } from '@/types/types';

export type TrafficUpdateData = TrafficFlow | TrafficSignal | Record<string, unknown>;

export interface TrafficUpdate {
  type: 'vehicle_detection' | 'signal_change' | 'flow_update';
  data: TrafficUpdateData;
  timestamp: number;
}

export interface ViolationAlert {
  id: string;
  type: 'red_light' | 'wrong_way';
  vehicleId: string;
  location: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: number;
}

export type TrafficUpdateCallback = (update: TrafficUpdate) => void;
export type ViolationAlertCallback = (alert: ViolationAlert) => void;
export type ConnectionStatusCallback = (connected: boolean) => void;

class SocketClient {
  private socket: Socket | null = null;
  private trafficUpdateCallbacks: Set<TrafficUpdateCallback> = new Set();
  private violationAlertCallbacks: Set<ViolationAlertCallback> = new Set();
  private connectionStatusCallbacks: Set<ConnectionStatusCallback> = new Set();
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private connectionUrl: string | null = null;

  /**
   * Initialize socket connection
   */
  connect(url: string = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001'): void {
    if (this.socket?.connected) {
      this.notifyConnectionStatus(true);
      return;
    }

    if (this.socket && this.connectionUrl === url) {
      return;
    }

    this.disconnect();
    this.connectionUrl = url;

    this.socket = io(url, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.socket.on('connect', () => {
      this.reconnectAttempts = 0;
      this.notifyConnectionStatus(true);
    });

    this.socket.on('disconnect', () => {
      this.notifyConnectionStatus(false);
    });

    this.socket.on('connect_error', () => {
      this.reconnectAttempts++;
      this.notifyConnectionStatus(false);
    });

    this.socket.on('traffic_update', (update: TrafficUpdate) => {
      this.notifyTrafficUpdate(update);
    });

    this.socket.on('violation_alert', (alert: ViolationAlert) => {
      this.notifyViolationAlert(alert);
    });
  }

  /**
   * Disconnect socket
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connectionUrl = null;
      this.notifyConnectionStatus(false);
    }
  }

  /**
   * Subscribe to traffic updates
   */
  onTrafficUpdate(callback: TrafficUpdateCallback): () => void {
    this.trafficUpdateCallbacks.add(callback);
    return () => {
      this.trafficUpdateCallbacks.delete(callback);
    };
  }

  /**
   * Subscribe to violation alerts
   */
  onViolationAlert(callback: ViolationAlertCallback): () => void {
    this.violationAlertCallbacks.add(callback);
    return () => {
      this.violationAlertCallbacks.delete(callback);
    };
  }

  /**
   * Subscribe to connection status changes
   */
  onConnectionStatus(callback: ConnectionStatusCallback): () => void {
    this.connectionStatusCallbacks.add(callback);
    return () => {
      this.connectionStatusCallbacks.delete(callback);
    };
  }

  /**
   * Emit a custom event
   */
  emit(event: string, data: unknown): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Get socket ID
   */
  getSocketId(): string | undefined {
    return this.socket?.id;
  }

  /**
   * Notify all traffic update subscribers
   */
  private notifyTrafficUpdate(update: TrafficUpdate): void {
    this.trafficUpdateCallbacks.forEach((callback) => {
      try {
        callback(update);
      } catch (error) {
        console.error('Error in traffic update callback:', error);
      }
    });
  }

  /**
   * Notify all violation alert subscribers
   */
  private notifyViolationAlert(alert: ViolationAlert): void {
    this.violationAlertCallbacks.forEach((callback) => {
      try {
        callback(alert);
      } catch (error) {
        console.error('Error in violation alert callback:', error);
      }
    });
  }

  /**
   * Notify all connection status subscribers
   */
  private notifyConnectionStatus(connected: boolean): void {
    this.connectionStatusCallbacks.forEach((callback) => {
      try {
        callback(connected);
      } catch (error) {
        console.error('Error in connection status callback:', error);
      }
    });
  }
}

export const socketClient = new SocketClient();

export default socketClient;
