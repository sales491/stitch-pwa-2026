'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
    useEffect(() => {
        if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

        // Never run the service worker in development — it causes stale cache issues
        if (process.env.NODE_ENV !== 'production') {
            // Unregister any previously installed SW so it doesn't block hot reloads
            navigator.serviceWorker.getRegistrations().then((registrations) => {
                registrations.forEach((r) => r.unregister());
            });
            return;
        }

        window.addEventListener('load', () => {
            navigator.serviceWorker
                .register('/sw.js', { scope: '/' })
                .then((registration) => {
                    console.log('[SW] Registered. Scope:', registration.scope);

                    // Check for updates on each load
                    registration.onupdatefound = () => {
                        const newSW = registration.installing;
                        if (!newSW) return;
                        newSW.onstatechange = () => {
                            if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
                                // New SW is ready — could show a "Refresh for updates" banner here
                                console.log('[SW] New version available. Refresh to update.');
                            }
                        };
                    };
                })
                .catch((err) => {
                    console.warn('[SW] Registration failed:', err);
                });
        });
    }, []);

    return null;
}
