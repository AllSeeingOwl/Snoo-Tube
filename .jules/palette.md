## 2026-04-05 - Custom Search Clear Buttons Overlap

**Learning:** When adding custom 'X' clear buttons to `input[type="search"]` elements, WebKit browsers (Chrome, Safari) natively inject their own cancel button `::-webkit-search-cancel-button`, causing duplicate, overlapping "X" icons. Additionally, absolute positioned elements (like shortcut hints) adjacent to the input need their CSS selectors updated (e.g., using `~` instead of `+`) if the DOM structure changes to accommodate the new button.

**Action:** Whenever implementing custom clear buttons on search inputs, always apply CSS to hide the native WebKit clear button (`-webkit-appearance: none; appearance: none;` on the pseudo-element) and verify that any adjacent UI elements (like shortcut hints) maintain correct positioning and visibility rules.

## 2024-04-06 - Preserve Focus on DOM Element Removal
**Learning:** When interactive elements (like table rows) are dynamically removed from the DOM (e.g., locking a station in an "unlocked only" filtered view), the browser resets focus to the document body, causing a disorienting loss of context for keyboard and screen reader users.
**Action:** When performing an action that removes the currently focused element from the DOM, always explicitly compute and save the reference to the logical next element (like the next or previous sibling row) before the DOM mutation, and restore focus to it after the re-render. If no logical element remains, focus a stable fallback element like a search input.
