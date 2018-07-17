/**
 * Service Worker
 *
 * @author Elze Kool <efrkool@live.nl>
 */

var preCacheList = [ 'index.html', 'script.js', 'bootstrap.min.css' ].map(function(url) {
    // Add base path to all URL's
    return '/examples/service-worker-simple/' + url
});

var cacheIdentifier = 'awesome-app';

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