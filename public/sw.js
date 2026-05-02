// ============================================================
// Marinduque Market Hub — Service Worker v6
// Strategy: Network-First for HTML pages, Cache-First for assets
// This ensures users always get fresh content after a deploy.
// ============================================================

const CACHE_NAME = 'mhub-shell-v8';

// Static assets to pre-cache (loaded on first install)
const STATIC_ASSETS = [
    '/',
    '/markethub-logo.png',
    '/manifest.json',
    '/ferry-schedule',
    '/my-barangay/calamity',
];

// ── Install: pre-cache static assets only ─────────────────────
self.addEventListener('install', (e) => {
    self.skipWaiting(); // Activate new SW immediately
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS).catch((err) => {
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

// ── Fetch ──────────────────────────────────────────────────────
self.addEventListener('fetch', (e) => {
    const { request } = e;
    const url = new URL(request.url);

    // Only handle GET requests from our own origin
    if (request.method !== 'GET') return;
    if (url.origin !== self.location.origin && !url.hostname.includes('supabase.co')) return;

    // ① Supabase / API calls — always network, never cache
    if (url.hostname.includes('supabase.co') || url.pathname.startsWith('/api/')) {
        e.respondWith(
            fetch(request).catch(() =>
                new Response(JSON.stringify({ error: 'Offline' }), {
                    status: 503,
                    headers: { 'Content-Type': 'application/json' },
                })
            )
        );
        return;
    }

    // ② Next.js static chunks (_next/static) — Cache-First (content-hashed, safe to cache forever)
    if (url.pathname.startsWith('/_next/static/')) {
        e.respondWith(
            caches.open(CACHE_NAME).then(async (cache) => {
                const cached = await cache.match(request);
                if (cached) return cached;
                const fresh = await fetch(request);
                if (fresh && fresh.status === 200) cache.put(request, fresh.clone());
                return fresh;
            })
        );
        return;
    }

    // ③ Other _next/ requests (HMR, image optimization) — network only
    if (url.pathname.startsWith('/_next/')) {
        e.respondWith(fetch(request));
        return;
    }

    // ④ Page navigations — NETWORK-FIRST so deploys are reflected immediately
    //    Falls back to cached shell only when offline
    if (request.mode === 'navigate') {
        e.respondWith(
            fetch(request)
                .then((fresh) => {
                    // Store a fresh copy for offline fallback
                    if (fresh && fresh.status === 200) {
                        const clone = fresh.clone();
                        caches.open(CACHE_NAME).then((c) => c.put(request, clone));
                    }
                    return fresh;
                })
                .catch(async () => {
                    // Offline — serve cached page or home shell
                    const cached = await caches.match(request);
                    if (cached) return cached;
                    const home = await caches.match('/');
                    return home || new Response('Offline — please check your connection.', {
                        status: 503,
                        headers: { 'Content-Type': 'text/plain' },
                    });
                })
        );
        return;
    }

    // ⑤ Everything else (images, fonts, manifests) — Cache-First with background revalidation
    e.respondWith(
        caches.open(CACHE_NAME).then(async (cache) => {
            const cached = await cache.match(request);
            if (cached) {
                // Serve stale immediately, refresh in background
                fetch(request).then((fresh) => {
                    if (fresh && fresh.status === 200) cache.put(request, fresh.clone());
                }).catch(() => {});
                return cached;
            }
            const fresh = await fetch(request);
            if (fresh && fresh.status === 200) cache.put(request, fresh.clone());
            return fresh;
        })
    );
});

