## 2026-03-29 - [Restoring keyboard focus in dynamically re-rendered lists]
**Learning:** When interacting with a custom element (like a table row acting as a button) that triggers a full DOM re-render of its parent container, the browser natively resets focus to the document body because the previously focused node is destroyed. This creates a highly disruptive experience for keyboard users who lose their navigation context.
**Action:** When a user interaction causes a list or table to re-render, explicitly cache the focused element's unique identifier (e.g., `data-station-name`) before the re-render, and use `document.querySelector` with `CSS.escape()` to find the newly rendered equivalent element and restore focus to it via `.focus()`.

## 2024-05-15 - Toast Feedback for Disabled Buttons
**Learning:** Relying solely on the native `title` attribute to explain why a button is disabled (via `aria-disabled="true"`) is inaccessible to touch device users and often missed by keyboard users.
**Action:** When using `aria-disabled="true"`, intercept the click/interaction event to trigger a transient toast notification containing the explanation text from the `title` attribute. This ensures all users receive context for disabled states regardless of input method.

## 2024-05-15 - Live Region Announcer for Search Filter
**Learning:** Screen reader users miss the context of results dynamically changing via Javascript lists, such as live search filters. Text updates only visual for sighted users.
**Action:** Pair text search inputs that trigger live filtering with `aria-live="polite"` visually hidden announcement regions. When filtering completes, explicitly set the textContent of the announcer to summarize the new result count (e.g. "5 stations found").

## 2024-05-18 - Visual Keyboard Shortcut Hints
**Learning:** Cluttering input placeholders with keyboard shortcuts (like `(Press '/')`) makes the placeholder text harder to read and doesn't look like an actual key.
**Action:** Use a dedicated `<kbd>` element styled to look like a key, positioned absolutely inside the input wrapper. Conditionally hide it via CSS (`:focus + .hint`, `:not(:placeholder-shown) + .hint`) to prevent overlap with typed text or browser-native clear buttons.
## 2026-04-02 - Avoid aria-label overwriting complex content
**Learning:** Applying `aria-label` to custom interactive elements (like `role="button"` on table rows or list items) completely overrides their visible text content, hiding valuable contextual data (like station lines, zones, and usage counts) from screen reader users.
**Action:** When adding interaction context to complex items, avoid overriding the whole element with `aria-label`. Instead, use a visually hidden `.sr-only` span inside the element to prepend the action verb, ensuring all text remains accessible.

## 2024-05-20 - Hide Decorative Elements from Screen Readers
**Learning:** Screen readers often announce emojis (like 🚇) or read `title` attributes on visual UI elements (like color badges). This can create redundant or confusing auditory output, especially when the text content already conveys the necessary information.
**Action:** Always wrap decorative emojis in `<span aria-hidden="true">` and add `aria-hidden="true"` to purely visual elements (like CSS color badges) that have text equivalents nearby to prevent duplicate announcements.
