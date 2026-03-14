import { createContext, useContext, useState, ReactNode } from 'react';

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
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);

  const addAlert = (data: Omit<EmergencyAlert, 'id' | 'timestamp' | 'acknowledged'>) => {
    const newAlert: EmergencyAlert = {
      ...data,
      id: Date.now().toString(),
      timestamp: new Date(),
      acknowledged: false,
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const acknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  const clearAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

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
