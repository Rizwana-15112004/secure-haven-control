import { useEffect } from 'react';
import { db } from '@/db';

export const useOfflineSync = () => {
    useEffect(() => {
        const syncOfflineData = async () => {
            try {
                // 1. Check if there are any pending SOS messages saved on the phone
                const pendingSOS = await db.sosQueue.toArray();
                if (pendingSOS.length === 0) return; // Nothing to sync!

                // 2. Get the Admin's IP address
                const serverIP = localStorage.getItem('serverIP') || 'http://10.68.230.30:3001';

                // 3. Try to send them to the Admin server
                for (const sos of pendingSOS) {
                    const response = await fetch(`${serverIP}/send-alert`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ type: 'staff_sos_delayed', ...sos })
                    });

                    if (response.ok) {
                        // 4. If successful, delete it from the phone's local memory!
                        if (sos.id) {
                            await db.sosQueue.delete(sos.id);
                        }
                        console.log("✅ Successfully synced delayed offline SOS to Admin!");
                    }
                }
            } catch (err) {
                // If it fails, the phone is still offline. Do nothing and try again later.
                console.log("⏳ Still offline. Keeping SOS in queue for next check.");
            }
        };

        // Run this check every 5 seconds
        const intervalId = setInterval(syncOfflineData, 5000);

        // Cleanup on unmount
        return () => clearInterval(intervalId);
    }, []);
};