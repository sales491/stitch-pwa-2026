---
description: Audit which pages have JSON-LD structured data and identify coverage gaps
---

# /json-ld-audit — Structured Data Coverage Audit

Run this workflow to map every public route against its JSON-LD schema coverage. Identifies missing schema that hurts AEO (AI Engine Optimization) and Google Rich Results eligibility.

Call with: `/json-ld-audit`

---

## Step 1 — Scan for existing JSON-LD in page files

Search the codebase for all JSON-LD injections:

```powershell
cd C:\projects\stitch\next-app
grep -rn "application/ld+json" src/ --include="*.tsx" --include="*.ts" -l
```

This lists every file that injects structured data.

---

## Step 2 — Map routes to schema types

Cross-reference the sitemap against the scan results. For each public route, record what schema is present.

### Current Known Coverage (update after each audit)

| Route | Schema Type | Status |
|---|---|---|
| `/` (root layout) | `Organization`, `WebSite` + `SearchAction` | ✅ |
| `/faq` | `FAQPage` | ✅ |
| `/gems/*` | `TouristAttraction`, `CollectionPage` | ✅ |
| `/gems-of-marinduque-feed/*` | `TouristAttraction`, `BreadcrumbList` | ✅ |
| All routes (via layout) | `BreadcrumbList` (dynamic) | ✅ |
| `/marketplace` | `CollectionPage` | ✅ |
| `/marketplace/[id]` | `Product`, `Offer` | ✅ |
| `/jobs` | `CollectionPage` | ✅ |
| `/jobs/[slug]` | `JobPosting` | ✅ |
| `/events` | `CollectionPage` | ✅ |
| `/events/[id]` | `Event` | ✅ |
| `/directory` | `CollectionPage` | ✅ |
| `/directory/[id]` | `LocalBusiness` | ✅ |
| `/island-hopping` | `TouristAttraction` | ✅ |
| `/moriones-festival` | `Event` | ✅ |
| `/things-to-do` | `TouristAttraction` | ✅ |
| `/ferry-schedule` | `TransportationService` | ✅ |
| `/commute` | `TransportationService` | ✅ |
| `/ports` | `CivicStructure` | ✅ |
| `/island-life/palengke` | `Market` | ✅ |
| `/community` | `WebPage` | ✅ |
| `/my-barangay/calamity` | `WebPage` | ✅ |

---

## Step 3 — Prioritize gaps by schema value

Fix gaps in this order (highest AEO / rich results value first):

1. **`JobPosting`** on `/jobs/[slug]` — Google shows rich job cards in search
2. **`Event`** on `/events/[id]` — Google shows rich event cards
3. **`LocalBusiness`** on `/directory/[id]` — Google Maps + Local Pack integration
4. **`Product`/`Offer`** on `/marketplace/[id]` — Shopping tab eligibility
5. **`TransportationService`** on `/ferry-schedule` — structured transport data for AI
6. **`Festival`** on `/moriones-festival` — tourism + event schema

---

## Step 4 — Implement missing schema

For each gap identified, add a `<script type="application/ld+json">` block to the relevant page component.

Pattern for a page component:
```tsx
// In your page.tsx or component
export default function YourPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    // ...
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* page content */}
    </>
  );
}
```

---

## Step 5 — Validate with Google Rich Results Test

After adding schema, verify at:
👉 https://search.google.com/test/rich-results

Test the specific page URL. Confirm:
- No errors (❌)
- Detected item types match what you intended
- All required fields are present

---

## Step 6 — Update the coverage table in this file

After completing the audit, update the table in Step 2 above to reflect the current state. Keep this as a living document.
