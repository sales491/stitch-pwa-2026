---
description: Pre-push safety checklist for all new code going to production
---

# /pre-push-checklist — Pre-Push Safety Gate

Run this workflow BEFORE every git push to production. Covers TypeScript, SEO, JSON-LD, sitemap, PWA, and Next.js best practices.

Call with: `/pre-push-checklist` — optionally name the page/feature you're pushing.

---

## Step 1 — TypeScript: Zero Errors

// turbo
```powershell
cd C:\projects\stitch\next-app; npx tsc --noEmit 2>&1 | Select-Object -First 50
```

✅ Pass: No output (zero errors).
❌ Fail: Fix ALL TypeScript errors before continuing. No `any` shortcuts.

---

## Step 2 — Sitemap: New public routes registered?

For any new public-facing page added, confirm it appears in `src/app/sitemap.ts`.

Check the STATIC_ROUTES array — new routes must be added with:
- Correct `changeFrequency` (hourly → daily → weekly → monthly)
- Correct `priority` (0.9 for core features, 0.7 for community, 0.5 for utility)

If it's a dynamic route fed by Supabase (e.g., a new `/things/[id]`), add the Supabase query block to `sitemap.ts`.

---

## Step 3 — Robots: Private routes blocked?

For any new authenticated-only or create/form routes, confirm the path is added to `DISALLOW_PATHS` in `src/app/robots.ts`.

Pattern: any route containing `/create`, `/new`, `/edit`, `/admin`, `/auth`, `/api/` must be disallowed.

---

## Step 4 — SEO: Run /taglish-seo on new public pages

For every new public-facing page, run the `/taglish-seo` workflow before this step.

Quick checklist:
- [ ] `alternates` uses `hreflangAlternates()` helper (NOT a bare canonical string)
- [ ] `title` is English-only
- [ ] `description` is Taglish for community pages, English-only for tourist pages
- [ ] At least one Tagalog keyword set is spread into `keywords`

---

## Step 5 — JSON-LD: Schema present on detail pages?

For any new detail page (listing, job, event, gem, business), confirm JSON-LD is injected.

Required schema by page type:

| Page type | Required schema |
|---|---|
| Marketplace listing | `Product` or `Offer` |
| Job posting | `JobPosting` |
| Event | `Event` |
| Gem / Tourist spot | `TouristAttraction` or `Place` |
| Business profile | `LocalBusiness` |
| FAQ page | `FAQPage` |
| Hub/feed page | `CollectionPage` |
| Navigation path | `BreadcrumbList` |

---

## Step 6 — Images: next/image only

Confirm no raw `<img>` tags are used in new components. All images must use `next/image` with a non-empty `alt` attribute.

```bash
# Quick grep check
grep -rn "<img " src/components/YourNewComponent.tsx
grep -rn "<img " src/app/your-new-route/
```

✅ Pass: No results.
❌ Fail: Replace `<img>` with `<Image>` from `next/image`.

---

## Step 7 — BackButton: All sub-pages covered?

For any new sub-page (not a top-level nav route), confirm `<BackButton />` is rendered at the top.

✅ Correct:
```tsx
import BackButton from '@/components/BackButton';
// In JSX:
<BackButton />
```

❌ Wrong: Hardcoded `<Link href="/">` or `<Link href="/marketplace">` as a back link.

---

## Step 8 — Loading states: loading.tsx present?

For any new route segment with async data fetching, confirm a `loading.tsx` file exists in the same directory.

---

## Step 9 — Final build check (optional but recommended for major pushes)

// turbo
```powershell
cd C:\projects\stitch\next-app; npx tsc --noEmit 2>&1 | Measure-Object -Line | Select-Object -ExpandProperty Lines
```

Zero lines = green light. Push it.

---

## Checklist Summary (copy-paste version)

```
[ ] Step 1: tsc --noEmit → 0 errors
[ ] Step 2: New public routes in sitemap.ts
[ ] Step 3: New private routes in robots.ts DISALLOW_PATHS
[ ] Step 4: /taglish-seo run on new public pages
[ ] Step 5: JSON-LD schema on new detail pages
[ ] Step 6: No raw <img> tags
[ ] Step 7: BackButton on new sub-pages
[ ] Step 8: loading.tsx for new async routes
```
