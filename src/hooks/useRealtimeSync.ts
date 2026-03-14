import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

const getServerURL = () => {
  const ip = localStorage.getItem('serverIP') || window.location.hostname;
  return `${window.location.protocol}//${ip}:8080/api/alerts`;
};

export function useRealtimeSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const url = `${getServerURL()}/events`;
    let es: EventSource;

    const connect = () => {
      es = new EventSource(url);

      es.addEventListener('donor_updated', (e: any) => {
        try {
          // Invalidate Queries to auto-refresh UI
          queryClient.invalidateQueries({ queryKey: ['donors'] });
          
          const data = JSON.parse(e.data);
          if (!data.deleted) {
             toast({
              title: "Data Updated",
              description: `A change was made to donor: ${data.name}. Synchronizing...`,
            });
          }
        } catch (_) {}
      });

      // You can add more listeners here for other types of updates
      // e.g., 'system_status', 'user_updated', etc.

      es.onerror = () => {
        es.close();
        setTimeout(connect, 3000); // Auto-retry
      };
    };

    connect();

    return () => {
      es?.close();
    };
  }, [queryClient]);
}
