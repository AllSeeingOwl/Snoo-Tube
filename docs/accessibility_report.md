# Accessibility Report

## Overview
This report evaluates the accessibility of the Tubey Games repository, assessing key HTML structure, ARIA attributes, semantic correctness, keyboard navigability, and visual feedback across the frontend games (`snooker`, `pool`, `paris`, `tokyo-snooker`, `tokyo-pool`).

## Evaluation Criteria & Checklist

### Passed Checks (✅)
1. ✅ **Language Declaration:** HTML document has `<html lang="en">`.
2. ✅ **Title:** Descriptive `<title>` is present in all pages.
3. ✅ **Viewport Meta Tag:** Used for proper scaling (`<meta name="viewport" content="width=device-width, initial-scale=1.0">`).
4. ✅ **Color Contrast:** CSS variables use high contrast colors (e.g., `#e0e0e0` on `#121212`).
5. ✅ **Focus Indicators:** `:focus-visible` is implemented with a clear outline (`outline: 2px solid var(--primary-color)`) across the apps and on the main Hub links.
6. ✅ **Aria-Labels & Controls:** `aria-label`, `aria-controls`, and `aria-hidden` are used extensively on inputs, buttons, and decorative icons.
7. ✅ **Live Regions:** Appropriate use of `aria-live` on announcer elements (`#search-announcer`, `#toast`, `#wildcard-announcer`).
8. ✅ **Modals:** Modal dialogs use `role="dialog"`, `aria-modal="true"`, and focus trapping logic is securely implemented.
9. ✅ **Visually Hidden Text (`sr-only`):** Contextual screen reader text is provided for dynamic elements like use counts and station rows.
10. ✅ **Keyboard Support:** Enter/Space keydown listeners are securely attached to interactive grid rows/lists, and Focus state is explicitly retained when items unlock or disappear.
11. ✅ **Table Semantics:** Data tables utilize `<thead>`, `<th scope="col">` and now include an explicit screen-reader-only `<caption>`.
12. ✅ **Semantic Landmarks:** Applications and the Hub menu make proper use of the `<main>` tag, and internal `<section>` blocks contain readable `aria-label`s.

### Initial Accessibility Score

Based on 10 standardized checks originally performed:
1. `lang` attribute: Pass
2. `<title>` tag: Pass
3. Heading structure: Pass
4. Semantic Landmarks: Fail (Hub page missing `<main>`, sections missing labels)
5. Form labels/aria-labels: Pass
6. Focus visibility: Fail (Hub page missing focus styles for links)
7. Keyboard interactivity: Pass
8. Focus management/traps: Pass
9. ARIA live regions: Pass
10. Table semantics: Fail (Missing `<caption>`)

**Initial Score: 7/10 (70%)**

## Action Taken

To exceed the 80% benchmark requested, the following changes were implemented across the codebase:
1. **Hub Page Semantics:** Wrapped the primary interactive content of `public/index.html` inside a semantic `<main>` tag.
2. **Hub Page Focus:** Added robust `:focus-visible` styles to the `.card` elements in `public/index.html` to clearly support keyboard navigation users.
3. **Table Accessibility:** Inserted a visually hidden `<caption>` into the primary data tables (`#stations-table`) in all five game variants to provide direct context to screen-readers entering the table scope.
4. **Section Landmarks:** Added a clear `aria-label="Search and filter stations"` to the search block `<section>` across all variants, distinguishing it cleanly from the results area.

## Final Accessibility Score

With the implementation of the above fixes, all 10 checks are passing successfully.

**Final Score: 10/10 (100%)**
