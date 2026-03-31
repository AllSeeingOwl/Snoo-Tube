## 2026-03-29 - [Restoring keyboard focus in dynamically re-rendered lists]
**Learning:** When interacting with a custom element (like a table row acting as a button) that triggers a full DOM re-render of its parent container, the browser natively resets focus to the document body because the previously focused node is destroyed. This creates a highly disruptive experience for keyboard users who lose their navigation context.
**Action:** When a user interaction causes a list or table to re-render, explicitly cache the focused element's unique identifier (e.g., `data-station-name`) before the re-render, and use `document.querySelector` with `CSS.escape()` to find the newly rendered equivalent element and restore focus to it via `.focus()`.

## 2024-05-15 - Toast Feedback for Disabled Buttons
**Learning:** Relying solely on the native `title` attribute to explain why a button is disabled (via `aria-disabled="true"`) is inaccessible to touch device users and often missed by keyboard users.
**Action:** When using `aria-disabled="true"`, intercept the click/interaction event to trigger a transient toast notification containing the explanation text from the `title` attribute. This ensures all users receive context for disabled states regardless of input method.

## 2024-05-15 - Live Region Announcer for Search Filter
**Learning:** Screen reader users miss the context of results dynamically changing via Javascript lists, such as live search filters. Text updates only visual for sighted users.
**Action:** Pair text search inputs that trigger live filtering with `aria-live="polite"` visually hidden announcement regions. When filtering completes, explicitly set the textContent of the announcer to summarize the new result count (e.g. "5 stations found").
