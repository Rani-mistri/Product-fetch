# Build an Advanced Infinite Scroll Product Feed

**Time:** 90 min | **React Hooks Only | No external libraries for scroll/virtualization**

---

## How It Should Look

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  🛍️ Products                                                 │
│                                                              │
│  🔍 [ Search products...                          ]          │
│                                                              │
│  Showing 248 results                                         │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  🖼️          │  │  🖼️          │  │  🖼️          │       │
│  │              │  │              │  │              │       │
│  │  iPhone 15   │  │  Galaxy S24  │  │  Pixel 9     │       │
│  │  ₹79,999     │  │  ₹64,999     │  │  ₹74,999     │       │
│  │  ★★★★★ (342) │  │  ★★★★☆ (218) │  │  ★★★★★ (156) │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  🖼️          │  │  🖼️          │  │  🖼️          │       │
│  │              │  │              │  │              │       │
│  │  MacBook Air │  │  Dell XPS 15 │  │  ThinkPad X1 │       │
│  │  ₹1,14,900   │  │  ₹1,29,990   │  │  ₹1,45,000   │       │
│  │  ★★★★☆ (89)  │  │  ★★★★★ (67)  │  │  ★★★★☆ (112) │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  ░░░░░░░░░░  │  │  ░░░░░░░░░░  │  │  ░░░░░░░░░░  │       │
│  │  ░ SKELETON ░│  │  ░ SKELETON ░│  │  ░ SKELETON ░│       │
│  │  ░░░░░░░░░░  │  │  ░░░░░░░░░░  │  │  ░░░░░░░░░░  │       │
│  │  ░░░░░░░░    │  │  ░░░░░░░░    │  │  ░░░░░░░░    │       │
│  │  ░░░░        │  │  ░░░░        │  │  ░░░░        │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                              │
│              ← Loading next page...                          │
│                                                              │
│  ┌────────────────────────────────────────────┐              │
│  │  ⚠️ Failed to load. [Retry]               │  ← on error │
│  └────────────────────────────────────────────┘              │
│                                                              │
│  ┌────────────────────────────────────────────┐              │
│  │  🎉 You've reached the end! (248 products)│  ← end state │
│  └────────────────────────────────────────────┘              │
│                                                              │
│                                          [ ↑ Back to Top ]   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Requirements

### 1. Infinite Scroll

- Load **12 products per page** (3 columns × 4 rows)
- When user scrolls within **300px of the bottom**, auto-fetch the next page
- Use **Intersection Observer API** — do NOT use scroll event listeners
- **Prevent duplicate fetches** — if a fetch is already in-progress, don't trigger another one
- When all products are loaded, show: **"🎉 You've reached the end! (248 products)"**
- If a page returns 0 results — that means end of list, stop triggering

### 2. Skeleton Loaders

- Show **shimmer/pulse animated placeholder cards** while loading — NOT a spinner
- Skeleton cards should match the real card layout (image box, title bar, price bar, rating dots)
- **Initial load:** show 12 skeleton cards filling the full grid
- **Next page load:** show 3–6 skeleton cards appended at the bottom
- On data arrival, skeletons get replaced by real product cards

### 3. Search with Debounce

- Search input at the top that filters products **by name**
- **Debounce by 500ms** — don't fire API on every keystroke, wait until user stops typing
- When search text changes:
  - **Clear the entire product list**
  - Reset to page 1
  - Show skeleton loaders during the fresh fetch
  - Infinite scroll continues to work within search results
- When search returns 0 results, show: **"No results found for '{query}'"**
- Clearing the search box resets to the full unfiltered feed
- **Race condition protection:** if user types "iph" then quickly types "one" (final = "iphone"), only ONE API call should fire for "iphone", NOT two separate calls

### 4. Error Handling

**Error while loading page 1 (no products yet):**
- Show a **full-page error** with a Retry button
- Clicking Retry re-fetches page 1

**Error while loading page N (products already visible):**
- Keep all existing products visible — do NOT clear them
- Show an **error banner at the bottom**: "Failed to load. [Retry]"
- Clicking Retry re-fetches the **exact same page** that failed

### 5. Scroll Position Restoration

This is the hard part. The flow:

```
User scrolls to product #150 (loaded 12 pages)
         │
         ▼
Clicks on a product card → detail view opens
         │
         ▼
Clicks "Back" (browser back OR in-app back)
         │
         ▼
┌─────────────────────────────────────┐
│ Feed MUST restore:                  │
│                                     │
│ 1. All 150 products still in memory │
│    (no re-fetching from page 1)     │
│ 2. Exact scroll position (px)       │
│ 3. Search query (if any was active) │
│ 4. Resume scroll from page 13      │
└─────────────────────────────────────┘
```

- All previously loaded products should be **cached/preserved** across navigation
- Scroll position should restore to the **exact pixel**
- Infinite scroll should resume from the next un-fetched page

### 6. Image Lazy Loading

- Product images should **only load when the card is near the viewport**
- Use Intersection Observer (same concept as infinite scroll, but per image)
- Show a **grey placeholder box** until the real image loads
- If image fails, show a **fallback icon** — don't break the card layout

### 7. Back to Top Button

- A floating **"↑ Back to Top"** button appears after scrolling past **500px**
- Clicking it **smooth-scrolls** to the top
- Button hides when near the top

### 8. Product Card

Each card shows:
- **Image** (lazy loaded)
- **Product name** (truncate with `...` if longer than 2 lines)
- **Price** (formatted: ₹1,14,900)
- **Star rating** with review count (★★★★☆ (218))
- Clicking a card navigates to a **detail view** (can be a simple page — just needed for testing scroll restore)

### 9. Responsive Grid

- **Desktop:** 3 columns
- **Tablet:** 2 columns
- **Mobile:** 1 column
- Infinite scroll and lazy loading must work across all breakpoints

---

## All Page States

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  1. INITIAL LOADING                             │
│     → 12 skeleton cards, no products yet        │
│                                                 │
│  2. SHOWING PRODUCTS                            │
│     → Grid of cards + scroll trigger at bottom  │
│                                                 │
│  3. LOADING NEXT PAGE                           │
│     → Existing products visible                 │
│     → Skeleton cards appended at bottom         │
│                                                 │
│  4. ALL LOADED                                  │
│     → "You've reached the end" message          │
│     → No more scroll trigger                    │
│                                                 │
│  5. ERROR — PAGE 1                              │
│     → Full page error + Retry button            │
│                                                 │
│  6. ERROR — PAGE N                              │
│     → Products visible + error banner at bottom │
│     → Retry re-fetches same failed page         │
│                                                 │
│  7. EMPTY SEARCH                                │
│     → "No results found for 'xyz'"              │
│                                                 │
│  8. SEARCHING (debounce in progress)            │
│     → User still typing                         │
│     → After debounce: clear → skeletons → fetch │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Edge Cases to Handle

1. **Scroll fires multiple times before fetch completes** — guard with `isFetching` flag, only 1 request at a time
2. **Rapid typing in search** — debounce must cancel/ignore previous pending calls; only final text triggers fetch
3. **Page 3 returns 0 results** — means end of list, show end message (even if pages 1–2 had data)
4. **Image fails to load** — show fallback icon, don't break card layout
5. **Fast scrolling past the trigger zone** — place the observer target ~300px above the true bottom to catch it
6. **Browser back button** — scroll position must restore (not just in-app back button)
7. **Window resize** — grid reflows (3→2→1 cols), scroll trigger still works
8. **Search returns less than 1 page** — show end message immediately, no scroll trigger
9. **User searches, scrolls down, then clears search** — must fully reset: clear products, page = 1, scroll to top, re-fetch all
10. **Slow network** — skeleton loaders stay visible until data arrives, user can still scroll existing content above

---

## Test Scenarios

### A — Basic Infinite Scroll
```
Page loads → 12 skeletons → replaced with products
Scroll to bottom → 3 skeletons at bottom → 12 more append
Keep scrolling → eventually "You've reached the end!"
```

### B — Search + Scroll
```
Type "laptop" → wait 500ms → list clears → skeletons → filtered results
Scroll down → loads more "laptop" results with infinite scroll
Clear search → list resets → all products from page 1
```

### C — Debounce Race Condition
```
Type "i" → (500ms timer starts)
Type "p" at 200ms → timer resets
Type "h" at 350ms → timer resets
Type "o" at 400ms → timer resets
Type "n" at 450ms → timer resets
Type "e" at 500ms → timer resets
After 500ms of no typing → ONE call fires for "iphone"
✅ No intermediate calls for "i", "ip", "iph"...
```

### D — Error Recovery
```
Scroll to page 5 → network fails
60 products still visible above
Error banner: "Failed to load. [Retry]"
Click Retry → page 5 fetches successfully → appends
```

### E — Scroll Position Restore
```
Scroll to product #100 → click a product → detail page
Click browser Back button
✅ Feed shows all 100 products
✅ Scroll position is exactly where you left
✅ Scroll down → loads page 9+ (continues, doesn't restart)
```

### F — Image Lazy Loading
```
Open DevTools Network tab → filter images
Only images in/near viewport should load
Scroll down → new images load as cards enter viewport
✅ Images below the fold are NOT requested until scrolled near
```

---

**What makes this hard:** It's not infinite scroll alone — that's simple. It's making scroll, search debounce, error recovery, scroll position restoration, and lazy images all work together without race conditions, duplicate fetches, or stale data. The scroll restore after back-navigation is what separates senior devs from everyone else.
