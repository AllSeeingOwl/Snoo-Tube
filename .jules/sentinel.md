## 2024-05-24 - Frame Busting and Error Sanitization
**Vulnerability:** Application could be embedded in malicious iframes (Clickjacking) because static hosting setup lacks X-Frame-Options headers. Error logs leaked raw objects.
**Learning:** Static client-only apps can't rely on HTTP response headers for Clickjacking protection, requiring a JS-based frame-busting fallback.
**Prevention:** Include frame-busting scripts in client-side apps by default. Sanitize all console error logs to prevent leaking internal stack traces.
