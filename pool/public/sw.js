// Service Worker for Pool Subway Offline Support
const CACHE_NAME = 'pool-subway-v1';
const ASSETS = [
    './',
    './index.html',
    './css/styles.css',
    './js/app.js',
    './manifest.json',
    './data/Pool_Subway_Database.csv'
];

// Install Event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                // 🛡️ Sentinel: Prevent SW installation failure due to missing assets
                // This guarantees the SW activates and the security mitigations in the fetch event are always applied.
                return Promise.allSettled(
                    ASSETS.map(url =>
                        fetch(url).then(response => {
                            if (response.ok) {
                                // 🛡️ Sentinel: Prevent insecure caching of sensitive data during install
                                const cacheControl = response.headers.get('Cache-Control');
                                if (cacheControl) {
                                    const lowerCacheControl = cacheControl.toLowerCase();
                                    if (lowerCacheControl.includes('no-store') || lowerCacheControl.includes('private')) {
                                        return;
                                    }
                                }
                                return cache.put(url, response);
                            }
                        }).catch(err => {
                            console.warn(`Failed to cache ${url}:`, err);
                        })
                    )
                );
            })
    );
    self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch Event
self.addEventListener('fetch', event => {
    // 🛡️ Sentinel: Mitigate Cache Poisoning and DoS risks
    // Only intercept and cache GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Do not cache requests with query strings to prevent cache storage DoS
    // (e.g. an attacker requesting /index.html?rand=1, ?rand=2...)
    const url = new URL(event.request.url);
    if (url.search) {
        event.respondWith(fetch(event.request));
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached response if found
                if (response) {
                    return response;
                }

                // Otherwise fetch from network
                return fetch(event.request).then(
                    function(networkResponse) {
                        // Check if we received a valid response
                        if(!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }

                        // 🛡️ Sentinel: Prevent insecure caching of sensitive data
                        // Do not cache if the response has Cache-Control: no-store or private
                        const cacheControl = networkResponse.headers.get('Cache-Control');
                        if (cacheControl) {
                            const lowerCacheControl = cacheControl.toLowerCase();
                            if (lowerCacheControl.includes('no-store') || lowerCacheControl.includes('private')) {
                                return networkResponse;
                            }
                        }

                        // Clone the response
                        const responseToCache = networkResponse.clone();

                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return networkResponse;
                    }
                );
            })
    );
});