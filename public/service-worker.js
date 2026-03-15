// Custom Service Worker for Secure Haven Control
// This ensures alerts can be received even if the browser tab is not active

self.addEventListener('install', (event) => {
  console.log('[SW] Service Worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Service Worker activated');
});

// Listener for Push Notifications (Government Alerts)
self.addEventListener('push', (event) => {
  console.log('[SW] Push Received:', event.data?.text());
  
  let data = { title: '🚨 EMERGENCY ALERT', body: 'Immediate threat detected. Open app.' };
  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {}

  const options = {
    body: data.body,
    icon: '/pwa-192x192.png',
    badge: '/favicon.ico',
    vibrate: [500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170, 40],
    tag: 'emergency-proximity-alert',
    renotify: true,
    requireInteraction: true,
    data: {
      url: self.location.origin
    },
    actions: [
      { action: 'open', title: 'Open Dashboard' },
      { action: 'dismiss', title: 'Acknowledge' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'dismiss') return;

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});
