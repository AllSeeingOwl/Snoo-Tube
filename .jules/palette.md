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

## 2024-03-23 - Custom Modal Focus Trap and Background Scrolling
**Learning:** For custom modals, simply calling `.focus()` on an input is insufficient for accessibility. Keyboard users can easily 'tab out' of the modal overlay into the hidden background page elements, losing context. Furthermore, scrolling with the mouse wheel can scroll the background instead of the modal.
**Action:** Always implement a complete accessibility package for custom modals: 1) apply `document.body.style.overflow = 'hidden'` on open (and restore on close) to prevent background scroll. 2) Implement a 'focus trap' listening for `keydown` 'Tab' events that circularly routes focus between the modal's first and last focusable elements.

## 2024-11-06 - Proactively Disabling Invalid Action Buttons
**Learning:** Action buttons that trigger states or modals dependent on certain prerequisites (e.g., a "Wildcard" button that requires at least one locked item to be useful) should not remain visually active only to return a negative "error toast" upon click. This "click-then-fail" pattern adds unnecessary cognitive load and user frustration.
**Action:** Always compute prerequisite states proactively. Visually disable buttons (via the `disabled` attribute and appropriate styling) when their action cannot be performed, and use `aria-disabled` and `title` attributes to explain *why* the button is unavailable (e.g., "No locked stations available to unlock."). This provides immediate, clear feedback without requiring interaction.

## 2025-03-25 - Context-Aware Escape in Nested Search Components
**Learning:** When a search input exists inside a modal that uses the `Escape` key to close (a standard UX pattern), pressing `Escape` to clear a search query often inadvertently closes the entire modal, causing frustration and context loss.
**Action:** For search inputs within modals, implement an `Escape` keydown listener that first clears the text and calls `e.stopPropagation()` to prevent the modal closure event from firing. The modal should only close natively on a subsequent `Escape` press when the input is already empty.
## 2024-11-20 - Disabled Elements and Tooltips
**Learning:** Applying `pointer-events: none` to disabled or `aria-disabled` buttons prevents all pointer events, which also completely disables native HTML `title` tooltips and custom cursors (like `cursor: not-allowed`). This prevents users from discovering *why* a button is disabled.
**Action:** To preserve keyboard focus and accessibility for disabled buttons with explanatory tooltips, use `aria-disabled="true"` and explicit JavaScript event blocking instead of the native HTML `disabled` attribute or CSS `pointer-events: none`.

## 2026-03-28 - Interactive Table Row Focus Rings
**Learning:** When custom interactive elements like table rows (`<tr>`) receive keyboard focus, the default `:focus-visible` outline is often clipped by the boundaries of the table container or adjacent row borders, making the focus state difficult to see and failing accessibility standards.
**Action:** Apply a negative `outline-offset` (e.g., `-2px`) to the `:focus-visible` state of interactive table rows to draw the focus ring inward, ensuring it remains fully visible within the element's bounding box without being clipped by the table structure.
