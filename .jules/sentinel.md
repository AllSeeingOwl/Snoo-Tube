## 2024-05-24 - Frame Busting and Error Sanitization
**Vulnerability:** Application could be embedded in malicious iframes (Clickjacking) because static hosting setup lacks X-Frame-Options headers. Error logs leaked raw objects.
**Learning:** Static client-only apps can't rely on HTTP response headers for Clickjacking protection, requiring a JS-based frame-busting fallback.
**Prevention:** Include frame-busting scripts in client-side apps by default. Sanitize all console error logs to prevent leaking internal stack traces.

## 2024-05-25 - Information Leakage via X-Powered-By Header
**Vulnerability:** The application was exposing the underlying server technology stack via the `X-Powered-By` header. This information can be used by attackers to target specific vulnerabilities.
**Learning:** Default configurations in frameworks like Express often include headers that leak information. It's important to explicitly disable them.
**Prevention:** Always disable the `X-Powered-By` header in Express applications using `app.disable('x-powered-by');` to minimize the attack surface.
