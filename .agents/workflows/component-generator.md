---
description: Boilerplate generation checklist to ensure uniform component architecture
---

# /component-generator — Component Standards

Run this workflow whenever creating a new React component to ensure it complies with the Marinduque Market Hub style and performance standards.

Call with: `/component-generator YourComponentName`

---

## The Scaffold

When generating a component, always use the following structure:

```tsx
'use client'; // Required if using hooks, state, or DOM events. Remove if strictly server-rendered.

import React from 'react';

// Optional: Zod schema for props if handling external data
// import { z } from 'zod';

/**
 * YourComponentName
 * 
 * [Brief description of what this does and where it is used in the app]
 */
export default function YourComponentName() {
    return (
        <div className="bg-white dark:bg-zinc-950 p-4 rounded-xl border border-slate-100 dark:border-zinc-800">
            {/* Content */}
        </div>
    );
}
```

## Step 1 — Directives
- Should this be a Client Component or Server Component?
- If it uses `useState`, `useEffect`, `onClick`, or browser APIs (like `window`), it **must** have `'use client';` at the top.
- If it fetches data directly from the DB securely, it should be a Server Component (no directive).

## Step 2 — Dark Mode Coverage
- Every generic color class needs a `dark:` equivalent.
- `bg-white` → `dark:bg-zinc-950`
- `text-slate-900` → `dark:text-white`
- `border-slate-100` → `dark:border-zinc-800`

## Step 3 — Navigation
- Is this component the main view for a sub-page (e.g. `/my-barangay/lost-found`)?
- Always include `<BackButton />` at the top level of the component's layout if there is no top-level native app navigation header.

## Step 4 — Images
- Never use raw `<img>` tags.
- Always import `Image` from `next/image`.
- Ensure you have `alt` text. No empty `alt=""`.

## Step 5 — Documentation
- Include a simple TSDoc `/** ... */` block above the component export, briefly explaining its role in the PWA.

---

## Execution
Review your component against these 5 steps. If all pass, proceed to save.
