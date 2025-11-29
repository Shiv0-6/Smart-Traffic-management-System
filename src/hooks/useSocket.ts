import { useEffect, useState } from 'react';
import socketClient, {
  TrafficUpdate,
  ViolationAlert,
} from '@/utils/socketClient';

export function useSocket(url?: string) {
  const [connected, setConnected] = useState(false);
  const [trafficUpdates, setTrafficUpdates] = useState<TrafficUpdate[]>([]);
  const [violationAlerts, setViolationAlerts] = useState<ViolationAlert[]>([]);

  useEffect(() => {
    socketClient.connect(url);

    const unsubscribeStatus = socketClient.onConnectionStatus((status) => {
      setConnected(status);
    });

    const unsubscribeTraffic = socketClient.onTrafficUpdate((update) => {
      setTrafficUpdates((prev) => [...prev.slice(-99), update]);
    });

    const unsubscribeViolation = socketClient.onViolationAlert((alert) => {
      setViolationAlerts((prev) => [...prev.slice(-99), alert]);
    });

    return () => {
      unsubscribeStatus();
      unsubscribeTraffic();
      unsubscribeViolation();
      socketClient.disconnect();
    };
  }, [url]);

  return {
    connected,
    trafficUpdates,
    violationAlerts,
    emit: socketClient.emit.bind(socketClient),
  };
}
