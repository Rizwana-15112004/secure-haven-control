import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

export type EmergencyAlert = {
  id: string;
  timestamp: Date;
  staffName: string;
  floor: string;
  injured: string;
  details: string;
  acknowledged: boolean;
};

interface EmergencyAlertContextType {
  alerts: EmergencyAlert[];
  addAlert: (alert: Omit<EmergencyAlert, 'id' | 'timestamp' | 'acknowledged'>) => void;
  acknowledgeAlert: (id: string) => void;
  clearAlert: (id: string) => void;
  unreadCount: number;
}

const EmergencyAlertContext = createContext<EmergencyAlertContextType | undefined>(undefined);

export function EmergencyAlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>(() => {
    // Try to load initial from local storage if available
    try {
      const saved = localStorage.getItem('sdrrs_emergency_alerts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('sdrrs_emergency_alerts', JSON.stringify(alerts));
  }, [alerts]);

  // Sync across tabs via BroadcastChannel (works locally even if alert server is down)
  useEffect(() => {
    const channel = new BroadcastChannel('sdrrs_emergency_channel');
    channel.onmessage = (event) => {
      if (event.data.type === 'SYNC_ALERTS') {
        setAlerts(event.data.alerts);
      }
    };
    return () => channel.close();
  }, []);

  const broadcastUpdate = (newAlerts: EmergencyAlert[]) => {
    const channel = new BroadcastChannel('sdrrs_emergency_channel');
    channel.postMessage({ type: 'SYNC_ALERTS', alerts: newAlerts });
    channel.close();
  };

  const addAlert = useCallback((data: Omit<EmergencyAlert, 'id' | 'timestamp' | 'acknowledged'>) => {
    setAlerts(prev => {
      // Check if it already exists to prevent duplicate (if SSE and BroadcastChannel both fire)
      const isDuplicate = prev.some(a => a.staffName === data.staffName && a.details === data.details && Date.now() - new Date(a.timestamp).getTime() < 10000);
      if (isDuplicate) return prev;

      const newAlert: EmergencyAlert = {
        ...data,
        id: Date.now().toString(),
        timestamp: new Date(),
        acknowledged: false,
      };
      const updated = [newAlert, ...prev];
      broadcastUpdate(updated);
      return updated;
    });
  }, []);

  const acknowledgeAlert = useCallback((id: string) => {
    setAlerts(prev => {
      const updated = prev.map(a => a.id === id ? { ...a, acknowledged: true } : a);
      broadcastUpdate(updated);
      return updated;
    });
  }, []);

  const clearAlert = useCallback((id: string) => {
    setAlerts(prev => {
      const updated = prev.filter(a => a.id !== id);
      broadcastUpdate(updated);
      return updated;
    });
  }, []);

  const unreadCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <EmergencyAlertContext.Provider value={{ alerts, addAlert, acknowledgeAlert, clearAlert, unreadCount }}>
      {children}
    </EmergencyAlertContext.Provider>
  );
}

export function useEmergencyAlerts() {
  const ctx = useContext(EmergencyAlertContext);
  if (!ctx) throw new Error('useEmergencyAlerts must be used within EmergencyAlertProvider');
  return ctx;
}
