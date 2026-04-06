---
description: Run Lighthouse audits and verify Progressive Web App (PWA) installability requirements
---

# /pwa-audit — Progressive Web App Health Check

Run this workflow periodically or before major releases to ensure the application remains installable, performant, and correctly caches its assets.

Call with: `/pwa-audit`

---

## Step 1 — PWA Installability Check

Verify the core criteria that allow browsers to prompt "Add to Home Screen". 

1. **Manifest**: Check `public/manifest.json`.
   - Has `name` and `short_name`
   - Has `icons` (192x192 and 512x512)
   - Has `start_url`
   - Has `display: "standalone"`
2. **Service Worker**: Check `public/sw.js` and `components/ServiceWorkerRegistration.tsx`.
   - Is the service worker registering without console errors?
   - Is it caching the core app shell routes?
3. **HTML Meta Tags**: Check `src/app/layout.tsx`.
   - Has `<meta name="theme-color" content="..." />`
   - Has Apple Touch Icon `<link rel="apple-touch-icon" href="..." />`

---

## Step 2 — Lighthouse Report

// turbo
```powershell
cd C:\projects\stitch\next-app
npx lighthouse http://localhost:3000 --output json --output-path ./lighthouse-report.json --only-categories=pwa,performance
```

*(Note: Requires the local dev server to be running. If not, start it first with `npm run dev`.)*

---

## Step 3 — Service Worker Cache Audit

The service worker in `sw.js` defines an `urlsToCache` array. 
- Are all the new major routes included?
- Example: If we added `/calendar`, is it in the cache list?

List the new routes added since the last audit and ensure the cache list in `public/sw.js` is up to date.

---

## Step 4 — Lighthouse Findings Review

If the Lighthouse report generated in Step 2 shows a PWA score below 100, read the exact failures from the `lighthouse-report.json` and fix them before shipping.

Pay special attention to:
- Service Worker registration scope.
- "Does not register a service worker that controls page and start_url".
- Valid maskable icons.
