const express = require('express');
const path = require('path');
const app = express();

// 🛡️ Sentinel: Disable x-powered-by header to prevent information leakage
app.disable('x-powered-by');

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Content-Security-Policy', "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; object-src 'none'; base-uri 'none'; require-trusted-types-for 'script'; form-action 'none'; upgrade-insecure-requests; frame-ancestors 'none';");
  next();
});

const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use('/data', express.static(path.join(__dirname, 'data')));

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
