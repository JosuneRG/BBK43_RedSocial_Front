self.addEventListener('push', (e) => {
  let data = {};
  try { data = e.data.json(); } catch {}
  const title = data.title || 'Notificación';
  const body  = data.body || '';
  const url   = data.url || '/';

  const options = {
    body,
    icon: '/icons/icon-192.png',
    badge: '/icons/badge-72.png',
    data: { url }
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = e.notification.data?.url || '/';
  e.waitUntil(clients.openWindow(url));
});
