// ============================================================
// Marinduque Market Hub — Service Worker v4
// Strategy: Cache-First for shell assets, Network-First for API
// ============================================================

const CACHE_NAME = 'mhub-shell-v5';

// Core app shell — pages that must load instantly, even offline
const SHELL_URLS = [
    '/',
    '/community',
    '/marketplace',
    '/commute',
    '/directory',
    '/login',
    '/profile',
];

// Static assets to pre-cache (loaded on first install)
const STATIC_ASSETS = [
    '/markethub-logo.png',
    '/manifest.json',
];

// ── Install: pre-cache the shell ──────────────────────────────
self.addEventListener('install', (e) => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // Cache shell pages and static assets
            return cache.addAll([...SHELL_URLS, ...STATIC_ASSETS]).catch((err) => {
                // Don't fail install if a single page is unavailable (e.g. login page redirects)
                console.warn('[SW] Pre-cache warning (non-fatal):', err);
            });
        })
    );
});

// ── Activate: remove OLD cache versions ───────────────────────
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => {
                        console.log('[SW] Deleting old cache:', key);
                        return caches.delete(key);
                    })
            )
        ).then(() => self.clients.claim())
    );
});

// ── Fetch: Cache-First for shell, Network-First for API ────────
self.addEventListener('fetch', (e) => {
    const { request } = e;
    const url = new URL(request.url);

    // Skip non-GET requests and cross-origin requests
    if (request.method !== 'GET') return;
    if (url.origin !== self.location.origin && !url.hostname.includes('supabase.co')) return;

    // Skip Supabase API calls — always go to network for live data
    if (url.hostname.includes('supabase.co') || url.pathname.startsWith('/api/')) {
        e.respondWith(
            fetch(request).catch(() => {
                // No offline fallback for API — just fail gracefully
                return new Response(JSON.stringify({ error: 'Offline' }), {
                    status: 503,
                    headers: { 'Content-Type': 'application/json' },
                });
            })
        );
        return;
    }

    // Skip Next.js internal requests
    if (url.pathname.startsWith('/_next/')) {
        e.respondWith(
            caches.match(request).then((cached) => cached || fetch(request))
        );
        return;
    }

    // Cache-First for everything else (pages, images, fonts)
    e.respondWith(
        caches.open(CACHE_NAME).then(async (cache) => {
            const cached = await cache.match(request);
            if (cached) {
                // Serve from cache immediately, revalidate in background
                fetch(request)
                    .then((fresh) => {
                        if (fresh && fresh.status === 200) {
                            cache.put(request, fresh.clone());
                        }
                    })
                    .catch(() => {/* ignore network errors during bg refresh */ });
                return cached;
            }

            // Cache miss — try network, then store result
            try {
                const fresh = await fetch(request);
                if (fresh && fresh.status === 200) {
                    cache.put(request, fresh.clone());
                }
                return fresh;
            } catch {
                // Network failed — try serving the home shell as fallback for navigation
                if (request.mode === 'navigate') {
                    const fallback = await cache.match('/');
                    return fallback || new Response('Offline — please check your connection.', {
                        status: 503,
                        headers: { 'Content-Type': 'text/plain' },
                    });
                }
                throw new Error('Offline');
            }
        })
    );
});
