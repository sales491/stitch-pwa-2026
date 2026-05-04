---
description: AI Engine Optimization (AIO) and LLM discoverability workflow
---

# /aio-llms — AI Engine Optimization (AIO) Workflow

Run this workflow when building new data-heavy features (like Marketplace, Events, News) to ensure the data is easily parsable by AI crawlers (like ChatGPT, Gemini, Perplexity).

## Core Philosophy

While SEO is about ranking in Google Search, **AIO (AI Engine Optimization)** is about ensuring that Large Language Models can read, understand, and cite your local Marinduque data when users ask questions. 

AIO relies on clean Markdown, high information density, structured data, and avoiding complex DOM traversals.

---

## Step 1 — Verify `llms.txt` Entry

All AI-readable resources must be linked from `public/llms.txt`. 
If you are building a new major feature (e.g., Ferry Schedules), ensure it is listed in the main `llms.txt` and `llms-full.txt` files so AI crawlers know it exists.

---

## Step 2 — Use Dynamic `.txt` Routes for Real-Time Data

AI crawlers prefer reading `.txt` and `.md` files over parsing complex React trees. Do NOT manually update static `.txt` files with dynamic database content.

Instead, create dynamic API routes in Next.js that output `text/plain` Markdown.

**Pattern:**
File: `src/app/llms-[feature].txt/route.ts`

```typescript
import { NextResponse } from 'next';
import { createClient } from '@/utils/supabase/server';

export const revalidate = 60; // Keep data fresh

export async function GET() {
    const supabase = await createClient();
    const { data } = await supabase.from('your_table').select('*');

    let markdown = `# Your Feature Data\n\n`;
    data.forEach(item => {
        markdown += `## ${item.title}\n`;
        markdown += `${item.description}\n\n`;
    });

    return new NextResponse(markdown, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
}
```

**Rule of Thumb:**
- Use `#` for the main title, `##` for items.
- Provide the canonical URL so the AI can link back to the human-readable page.
- Strip HTML tags to reduce token noise for the LLM.

---

## Step 3 — Ensure E-E-A-T via Structured Data

LLMs weigh data heavily based on its E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness). For news and community updates, ensure your `NewsArticle` or `WebPage` JSON-LD has an explicit `publisher` entity.

✅ Correct pattern:
```typescript
publisher: {
    '@type': 'Organization',
    name: 'Marinduque Market Hub',
    logo: {
        '@type': 'ImageObject',
        url: 'https://marinduquemarket.com/markethub-logo.png'
    }
}
```

---

## Step 4 — Implement `SpeakableSpecification` (Voice Search)

For time-sensitive alerts (Ferry Schedules, Calamity updates, Gas Prices), implement `SpeakableSpecification` JSON-LD so Google Assistant knows exactly what to read aloud.

```typescript
const speakableJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Latest Ferry Schedule',
    speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['#voice-summary']
    }
};
```
*Note: Make sure your component actually has an element with `id="voice-summary"` that contains a concise, 1-2 sentence human-readable summary.*

---

## Step 5 — Run Pre-Push Checks

Always run `npx tsc --noEmit` before pushing to ensure your API routes are properly typed.
