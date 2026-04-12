const express = require('express');
const path = require('path');
const app = express();

// 🛡️ Sentinel: Disable x-powered-by header to prevent information leakage
app.disable('x-powered-by');

// 🛡️ Sentinel: Configure Express to trust the reverse proxy for accurate client IP resolution
app.set('trust proxy', 1);

// 🛡️ Sentinel: Enforce maximum URL length to prevent DoS attacks via excessively long URLs
app.use((req, res, next) => {
  if (req.url.length > 2048) {
    res.setHeader('Cache-Control', 'no-store');
    return res.type('text/plain').status(414).send('URI Too Long');
  }
  next();
});

// 🛡️ Sentinel: Enforce payload size limits to mitigate DoS attacks via excessively large request bodies
app.use((req, res, next) => {
  const contentLength = req.headers['content-length'];
  if (contentLength && parseInt(contentLength, 10) > 10240) { // 10KB limit
    res.setHeader('Cache-Control', 'no-store');
    return res.type('text/plain').status(413).send('Payload Too Large');
  }
  // This application does not expect chunked uploads. Block to prevent chunked DoS.
  if (req.headers['transfer-encoding'] === 'chunked') {
    res.setHeader('Cache-Control', 'no-store');
    return res.type('text/plain').status(411).send('Length Required');
  }
  next();
});

// 🛡️ Sentinel: Simple rate limiting to mitigate DoS attacks
const rateLimitMap = new Map();
const rateLimitTimer = setInterval(() => {
  if (rateLimitMap.size > 10000) {
    // Prevent unbounded memory growth
    rateLimitMap.clear();
  } else {
    rateLimitMap.clear();
  }
}, 60000); // Clear every minute
rateLimitTimer.unref(); // Prevent timer from hanging process exit

app.use((req, res, next) => {
  const ip = req.ip || req.socket.remoteAddress;

  // 🛡️ Sentinel: Prevent Memory DoS from spoofed IPs when behind a proxy
  if (rateLimitMap.size >= 10000 && !rateLimitMap.has(ip)) {
      res.setHeader('Cache-Control', 'no-store');
      return res.type('text/plain').status(429).send('Too many requests, please try again later.');
  }

  const count = (rateLimitMap.get(ip) || 0) + 1;
  rateLimitMap.set(ip, count);
  if (count > 300) {
    res.setHeader('Cache-Control', 'no-store');
    return res.type('text/plain').status(429).send('Too many requests, please try again later.');
  }
  next();
});

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Content-Security-Policy', "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; object-src 'none'; base-uri 'none'; require-trusted-types-for 'script'; form-action 'none'; upgrade-insecure-requests; frame-ancestors 'none';");
  // 🛡️ Sentinel: Cross-Origin Isolation headers to mitigate XS-Leaks and Spectre attacks
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  next();
});

const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use('/data', express.static(path.join(__dirname, 'data')));

// 🛡️ Sentinel: Generic 404 handler to prevent path disclosure and override Express default
app.use((req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.type('text/plain').status(404).send('Not Found');
});

// 🛡️ Sentinel: Global error handler to prevent stack trace leakage
app.use((err, req, res, next) => {
  console.error('An error occurred:', err); // Internal logging
  res.setHeader('Cache-Control', 'no-store');
  res.type('text/plain').status(500).send('Internal Server Error'); // Sanitized client response
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
