// Haku Service Worker — spec 018 (push notifications)

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(clients.claim()));

self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  const title = data.title ?? 'Haku';
  const options = {
    body: data.body ?? '',
    icon: '/icon.svg',
    badge: '/icon.svg',
    data: { url: data.url ?? '/' },
    tag: data.tag ?? 'haku-push',
    requireInteraction: false,
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? '/';
  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((wcs) => {
        const match = wcs.find((wc) => wc.url.endsWith(url));
        if (match) return match.focus();
        return clients.openWindow(url);
      })
  );
});
