/**
 * Service Worker
 *
 * @author Elze Kool <efrkool@live.nl>
 */

var preCacheList = [ 'index.html', 'script.js', 'bootstrap.min.css' ].map(function(url) {
    // Add base path to all URL's
    return '/examples/push/client-app/' + url
});

var cacheIdentifier = 'push-client-app';

self.addEventListener('install', function(event) {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(cacheIdentifier).then(function(cache) {
            return cache.addAll(preCacheList);
        })
    );
});

self.addEventListener('activate', function(event) {
    console.log('Service Worker activated!');
});

self.addEventListener('fetch', function(event) {
    var url = new URL(event.request.url);
    if (url.origin === location.origin && preCacheList.indexOf(url.pathname) !== -1) {
        event.respondWith(caches.match(url.pathname));
    }
});

// Add an event listener that listens for push messages
self.addEventListener('push', function(event) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    var title = 'Push example';
    var message = event.data.text();

    event.waitUntil(self.registration.showNotification(title, {
        body: message
    }));
});

// Add an event listener that handles notifications
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('http://localhost:5040/examples/push/client-app/')
    );
});