## 2024-05-24 - Frame Busting and Error Sanitization
**Vulnerability:** Application could be embedded in malicious iframes (Clickjacking) because static hosting setup lacks X-Frame-Options headers. Error logs leaked raw objects.
**Learning:** Static client-only apps can't rely on HTTP response headers for Clickjacking protection, requiring a JS-based frame-busting fallback.
**Prevention:** Include frame-busting scripts in client-side apps by default. Sanitize all console error logs to prevent leaking internal stack traces.

## 2024-05-25 - Information Leakage via X-Powered-By Header
**Vulnerability:** The application was exposing the underlying server technology stack via the `X-Powered-By` header. This information can be used by attackers to target specific vulnerabilities.
**Learning:** Default configurations in frameworks like Express often include headers that leak information. It's important to explicitly disable them.
**Prevention:** Always disable the `X-Powered-By` header in Express applications using `app.disable('x-powered-by');` to minimize the attack surface.

## 2024-05-26 - Unbounded Memory Growth in Rate Limiters
**Vulnerability:** A custom rate-limiting Map could grow without bounds if flooded with uniquely spoofed `X-Forwarded-For` IPs before the cleanup interval runs, leading to an Out-Of-Memory (OOM) Denial of Service (DoS).
**Learning:** When an application trusts proxies (`app.set('trust proxy', 1)`), client IPs can be spoofed. Storing unrestricted entries based on these IPs creates a severe memory vulnerability.
**Prevention:** Always enforce a hard size limit on in-memory storage structures (like Maps or Arrays) that use untrusted user input (like IPs or headers) as keys. Fail securely (e.g., return `429 Too Many Requests`) when the limit is reached.

## 2026-04-07 - Cross-Origin Isolation for Spectre Mitigation
**Vulnerability:** The application was not fully cross-origin isolated, leaving it potentially vulnerable to side-channel attacks like Spectre and XS-Leaks.
**Learning:** Enabling cross-origin isolation requires both `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp`.
**Prevention:** Always implement COOP and COEP headers to protect against cross-origin data leakage and enable powerful browser features securely.

## 2024-05-27 - Risk of Global Method Restriction vs Length Limitations
**Vulnerability:** Application lacked explicit URL length limits, making it susceptible to DoS attacks via excessively long URLs or buffer exhaustion.
**Learning:** Attempting to reduce attack surface by globally restricting HTTP methods (e.g., rejecting POST/PUT) is highly risky and often causes severe functional regressions. Length and size limits provide a much safer, non-breaking mitigation.
**Prevention:** To mitigate DoS attacks, always prefer setting strict but reasonable length limits on URLs (e.g., 2048 characters) and payload sizes rather than globally restricting core protocol features.

## 2026-04-07 - Resilient Service Worker Installation
**Vulnerability:** Service Worker used `cache.addAll()` during the `install` phase. This function requires all assets to load successfully. If any single asset returned a 404 or failed to load, the entire Service Worker would fail to install. This silently disabled all security mitigations implemented in the `fetch` event (e.g., preventing cache poisoning from query strings).
**Learning:** `cache.addAll()` is brittle and dangerous when a Service Worker includes critical security logic. A single missing asset can inadvertently disable the application's security posture.
**Prevention:** Always use resilient caching strategies like `Promise.allSettled()` with individual `fetch` and `cache.put()` calls during the `install` event to ensure the Service Worker always activates, even if some assets fail to cache.

## 2026-04-10 - Explicit Content-Type for Error Handlers
**Vulnerability:** Default Express text responses (like simple 404/500 messages) use `text/html`. If these error messages ever reflect user input in the future, it could lead to XSS.
**Learning:** Browsers might attempt to parse plain string responses as HTML if the `Content-Type` defaults to `text/html`.
**Prevention:** Always explicitly set `res.type('text/plain')` for generic text-based error responses to provide defense-in-depth against MIME confusion and potential XSS.
## 2024-04-11 - Explicit Content-Type for Generic Error Responses
**Vulnerability:** Default Express text responses (like simple 414 or 429 messages) use `text/html`. If these error messages ever reflect user input in the future, it could lead to XSS.
**Learning:** Browsers might attempt to parse plain string responses as HTML if the `Content-Type` defaults to `text/html`. Caching mechanisms might store these error states improperly.
**Prevention:** Always explicitly set `res.type('text/plain')` and `Cache-Control: no-store` for generic text-based error responses (such as rate limits or URI length checks) to provide defense-in-depth against MIME confusion, potential XSS, and caching of error states.

## 2026-04-12 - Missing Payload Size Limits
**Vulnerability:** The application lacked explicit request payload size limits, leaving it susceptible to Denial of Service (DoS) attacks via excessively large request bodies or chunked encoding, even on endpoints that do not process bodies.
**Learning:** Default static servers and fallback error handlers do not automatically reject large payloads, meaning an attacker could exhaust server bandwidth or connection pool resources by sending massive requests.
**Prevention:** Always implement explicit maximum payload size limits (e.g., via `Content-Length`) and restrict `Transfer-Encoding: chunked` if streaming uploads are not expected, providing defense-in-depth against resource exhaustion DoS.
