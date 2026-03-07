const CACHE_NAME = 'markethub-cache-v2';

// Add core static assets
const PRECACHE_ASSETS = [
    '/',
    '/manifest.json',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
];

// Origins we want to cache (specifically Supabase for data/images)
const ALLOWED_ORIGINS = [
    self.location.origin,
    'https://rhrkxuoybkdfdrknckjd.supabase.co', // Marinduque Market Hub Supabase Project
    'https://fonts.googleapis.com',             // Google Fonts for Material Symbols
    'https://fonts.gstatic.com'                  // Font files
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRECACHE_ASSETS);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Delete old versions
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // Only target typical GET requests
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);

    // 🚨 Explicitly Bypass Cache for Sensitive or Dynamic API Routes
    if (url.pathname.startsWith('/api/notifications') || url.pathname.startsWith('/api/profiles')) {
        return; // Let the browser handle these normally (Network Only)
    }

    // Check if the origin should be cached (internal or specific external providers)
    const isAllowedOrigin = ALLOWED_ORIGINS.some(origin => event.request.url.startsWith(origin));
    if (!isAllowedOrigin) return;

    // Stale-While-Revalidate Strategy
    // Serve from cache immediately if available, while fetching update in background
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            const fetchPromise = fetch(event.request).then((networkResponse) => {
                // Cache valid responses (Basic or CORS)
                if (networkResponse && networkResponse.status === 200 &&
                    (networkResponse.type === 'basic' || networkResponse.type === 'cors')) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            }).catch(() => {
                // Return cachedResponse if network fails (already handled by caches.match)
            });

            return cachedResponse || fetchPromise;
        })
    );
});
