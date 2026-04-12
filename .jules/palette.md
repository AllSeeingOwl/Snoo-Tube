## 2026-04-05 - Custom Search Clear Buttons Overlap

**Learning:** When adding custom 'X' clear buttons to `input[type="search"]` elements, WebKit browsers (Chrome, Safari) natively inject their own cancel button `::-webkit-search-cancel-button`, causing duplicate, overlapping "X" icons. Additionally, absolute positioned elements (like shortcut hints) adjacent to the input need their CSS selectors updated (e.g., using `~` instead of `+`) if the DOM structure changes to accommodate the new button.

**Action:** Whenever implementing custom clear buttons on search inputs, always apply CSS to hide the native WebKit clear button (`-webkit-appearance: none; appearance: none;` on the pseudo-element) and verify that any adjacent UI elements (like shortcut hints) maintain correct positioning and visibility rules.

## 2024-04-06 - Preserve Focus on DOM Element Removal
**Learning:** When interactive elements (like table rows) are dynamically removed from the DOM (e.g., locking a station in an "unlocked only" filtered view), the browser resets focus to the document body, causing a disorienting loss of context for keyboard and screen reader users.
**Action:** When performing an action that removes the currently focused element from the DOM, always explicitly compute and save the reference to the logical next element (like the next or previous sibling row) before the DOM mutation, and restore focus to it after the re-render. If no logical element remains, focus a stable fallback element like a search input.

## 2026-04-07 - Accessible Scrollable Regions and Modal Focus Management

**Learning:** Scrollable containers without interactive elements (like the stations table or the rules text) are completely inaccessible to keyboard-only users who cannot use a mouse to scroll. Additionally, focusing the 'Close' button at the *bottom* of a modal containing long text causes screen readers to skip the content entirely.
**Action:** Always add `tabindex="0"`, `role="region"`, and an `aria-label` to containers that rely on `overflow: auto`. When opening modals with instructional text, always focus the first interactive element at the top of the modal (like the top close button) to preserve reading order.

## 2025-05-16 - Programmatic Association of Dynamic Inputs

**Learning:** When text inputs, selects, or other interactive elements dynamically update a separate section of the page (like a search input filtering a list or a dropdown altering table contents), screen reader users may not be aware of which specific container is being modified, reducing clarity and predictability.
**Action:** Always use the `aria-controls` attribute on interactive elements that dynamically modify separate sections of the UI. Ensure the value of `aria-controls` matches the `id` of the target container being modified (e.g., `aria-controls="stations-body"`).
## 2026-04-12 - Add hidden contextual text to isolated numeric table cells
**Learning:** Purely numeric data in data table cells (e.g., a "Used" count displaying only "2") lacks context when navigated by a screen reader in isolation or sequentially, causing confusion.
**Action:** When displaying isolated numbers, append a visually hidden `.sr-only` span containing a pluralized, contextual label (e.g., " uses") directly within the cell so screen readers announce "2 uses" while the visual design remains clean.
