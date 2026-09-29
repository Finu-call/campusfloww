self.addEventListener('push', event => {
    let data = {};
    try { data = event.data ? event.data.json() : {}; } catch (_) {}
    const title = data.title || 'CampusFlow';
    const options = {
        body: data.message || 'You have a new notification.',
        icon: data.icon || '/favicon.ico',
        badge: data.badge || '/favicon.ico',
        tag: data.tag || 'campusflow-notification',
        data: { route: data.route || '#notifications' },
        vibrate: [150, 80, 150]
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    const route = event.notification.data?.route || '#notifications';
    event.waitUntil((async () => {
        const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        for (const client of clients) {
            if ('focus' in client) {
                await client.focus();
                try { await client.navigate(new URL(route, self.location.origin).href); } catch (_) {}
                return;
            }
        }
        if (self.clients.openWindow) {
            await self.clients.openWindow(new URL(route, self.location.origin).href);
        }
    })());
});