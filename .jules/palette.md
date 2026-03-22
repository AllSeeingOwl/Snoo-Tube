## 2023-10-27 - Custom Table Row Interactive Elements Missing ARIA States
**Learning:** This app extensively uses custom interactive elements, such as table rows (`<tr>`), as buttons (via `role="button"` and `tabIndex="0"`). A critical accessibility gap was discovered where "locked" rows simply displayed a visual padlock icon but still announced themselves as actionable (e.g., "Record use for [Station]") and lacked any `aria-disabled` state. Consequently, screen reader users would attempt to activate them, only to hit an unexpected error state.
**Action:** When implementing or reviewing custom pseudo-buttons (like interactive table rows), ensure that disabled or locked states are explicitly communicated via `aria-disabled="true"` and an updated, context-aware `aria-label` (e.g., "Station locked. Record use for [Station]"). Do not rely solely on visual styling or icons to communicate state changes on custom interactables.

## 2024-05-24 - Dead-end Empty States vs Actionable Empty States
**Learning:** When users encounter empty states resulting from search queries or filters, a simple "No items found" message creates a friction point, forcing them to manually delete their query character by character or navigate away to reset filters.
**Action:** Always provide an actionable empty state (e.g., a "Clear Search" button) for any user-driven filtering mechanism to quickly return them to a productive state. Empty states should guide recovery, not just report failure.

## 2024-10-31 - Focus Loss on Ephemeral Actionable Elements
**Learning:** When actionable empty states (like a "Clear Search" button) are clicked, they trigger an immediate UI re-render that removes the button from the DOM. This causes keyboard users to abruptly lose focus, which resets to the start of the document `<body>`, forcing them to tab back through the entire page hierarchy.
**Action:** Whenever a button's primary action involves its own destruction or removal from the DOM (e.g., clearing a search state that hides the empty state view), ensure focus is explicitly shifted to the most logical next element in the workflow, such as the search input that was just cleared.

## 2026-03-22 - Global Keyboard Shortcuts in Vanilla JS
**Learning:** Adding a global `/` keyboard shortcut significantly improves accessibility and speed for power users to focus the primary search input. However, in a pure vanilla HTML/JS application, it is crucial to proactively call `e.preventDefault()` inside the `keydown` event handler *before* focusing the input, otherwise the trigger key (`/`) will immediately bleed into the focused input field as a typed character.
**Action:** Always verify that keyboard shortcut listeners include logic to ignore the event when focus is already within interactive input/textarea elements, and ensure `e.preventDefault()` is invoked before calling `.focus()` on the target.
