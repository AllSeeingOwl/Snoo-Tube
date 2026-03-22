## 2024-05-24 - Remove innerHTML usage for DOM manipulation
**Vulnerability:** DOM-Based Cross-Site Scripting (XSS) risk via `innerHTML`.
**Learning:** The codebase generally used safe DOM APIs (`document.createElement`, `textContent`) for dynamic content rendering, but fell back to `innerHTML` for static error/empty state messages. While the strings were currently hardcoded, this established a vulnerable pattern that could be easily copied or modified to include user input or external data in the future.
**Prevention:** Strictly enforce the use of `document.createElement`, `textContent`, and safe DOM manipulation methods across the entire codebase, even for seemingly static HTML snippets. Use `.textContent = ''` to clear child nodes instead of `.innerHTML = ''`.
## 2024-05-24 - Validate localStorage schema to prevent Client-Side Injections
**Vulnerability:** Untrusted/Unvalidated `localStorage` data deserialization.
**Learning:** Directly assigning `JSON.parse(localStorage.getItem(...))` to critical app state variables without schema validation allows tampered local state to cause application crashes, logic bypasses, or prototype pollution if object structures are blindly trusted.
**Prevention:** Always validate the structure and types of data retrieved from `localStorage` before merging it into application state. Use defensive programming (e.g. `Object.create(null)`) for dictionaries mapping user input to prevent `__proto__` injection.
