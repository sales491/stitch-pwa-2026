---
description: Pre-push Taglish SEO pass for new public-facing pages
---

# /taglish-seo — Pre-Push SEO Enrichment

Run this workflow on any new public-facing page BEFORE pushing to production.
Call it with: `/taglish-seo` and specify the file(s) to review.

## When to run

After you have built a new page in English and are ready to push. This is the
final metadata polish step — it does NOT touch UI copy or page content.

---

## Step 1 — Check hreflang

Confirm `alternates` uses the central helper, not a bare canonical:

✅ Correct:
```ts
import { hreflangAlternates } from '@/utils/seo';
alternates: hreflangAlternates('/your-path'),
```

❌ Wrong:
```ts
alternates: { canonical: 'https://...' },
```

---

## Step 2 — Check `title`

Keep English-only. Never Taglish in title tags.

✅ `'Ferry Schedule 2026 — Marinduque'`
❌ `'Iskidyul ng Ferry — Marinduque'`

---

## Step 3 — Classify the page type

| Page type | Description treatment | Keywords treatment |
|---|---|---|
| **Tourist/diaspora** (ferry, moriones, things-to-do, gems) | English only | Add Tagalog keywords |
| **Local/community** (marketplace, jobs, community, barangay, OFW, events) | Taglish OK | Add Tagalog keywords |

---

## Step 4 — Add Tagalog keywords from `seo.ts`

Import and spread the right keyword set(s):

```ts
import { hreflangAlternates, TAGALOG_KEYWORDS_MARKETPLACE } from '@/utils/seo';

keywords: ['existing keyword', 'another keyword', ...TAGALOG_KEYWORDS_MARKETPLACE],
```

### Available keyword sets

| Export | Use for |
|---|---|
| `TAGALOG_KEYWORDS_COMMUNITY` | Community boards, social feed |
| `TAGALOG_KEYWORDS_MARKETPLACE` | Buy & sell, classifieds |
| `TAGALOG_KEYWORDS_JOBS` | Jobs, employment, skills |
| `TAGALOG_KEYWORDS_DIRECTORY` | Businesses, shops, services |
| `TAGALOG_KEYWORDS_EVENTS` | Events, festivals, fiestas |
| `TAGALOG_KEYWORDS_GEMS` | Tourist spots, attractions |
| `TAGALOG_KEYWORDS_TRAVEL` | Getting to Marinduque, transport |
| `TAGALOG_KEYWORDS_ISLAND_LIFE` | Tides, gas, outages, palengke |
| `TAGALOG_KEYWORDS_OFW` | OFW, remittance, exchange rates |
| `TAGALOG_KEYWORDS_BARANGAY` | Barangay board, calamity, lost & found |

You can spread multiple: `...TAGALOG_KEYWORDS_TRAVEL, ...TAGALOG_KEYWORDS_GEMS`

---

## Step 5 — Taglish description (local pages only)

For community/local pages, rewrite the description with a Taglish opener:

**Pattern**: Tagalog opener phrase + English detail sentence.

Examples:
- `'Hanapin ang trabaho sa Marinduque — full-time, part-time, at freelance positions sa Boac...'`
- `'Mag-bilihan at mag-bentahan sa Marinduque — furniture, electronics, damit, at iba pa.'`
- `'Nawala o natagpuan? I-post ang inyong lost and found items sa Marinduque...'`
- `'Para sa mga OFW at pamilya sa Marinduque — live exchange rates...'`

Keep descriptions under ~155 characters for Google snippet display.

---

## Step 6 — Final check

```bash
npx tsc --noEmit
```

Zero errors = ready to push.

---

## Step 7 — Verify JSON-LD

Don't forget to run the `json-ld-audit` or simply confirm that the correct `<script type="application/ld+json">` tag has been injected into the new route if it represents a core entity (Business, Product, Job, Event, Collection).
