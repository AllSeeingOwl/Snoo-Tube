// Sentry error reporting for the server.
// This file must be required before anything else in server.js so Sentry can
// hook into Express. Sentry stays off unless SENTRY_DSN is set, so local runs
// and tests send nothing.
const Sentry = require('@sentry/node');

const dsn = process.env.SENTRY_DSN || '';
const environment = process.env.NODE_ENV || 'development';
// Render sets RENDER_GIT_COMMIT on every deploy, so each error shows which
// commit it came from.
const release = process.env.RENDER_GIT_COMMIT || undefined;

if (dsn) {
  Sentry.init({
    dsn,
    environment,
    release,
    // The server only serves static files, so performance tracing is off by
    // default. Set SENTRY_TRACES_SAMPLE_RATE (0 to 1) to turn it on.
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE) || 0,
    // Players' IP addresses and request details stay out of Sentry.
    sendDefaultPii: false,
  });
}

// Settings the browser needs, served to the trackers by /shared/sentry-config.js.
// null turns browser reporting off.
const browserConfig = dsn ? { dsn, environment, release } : null;

// The origin browsers send error reports to. It has to be allowed by the
// Content-Security-Policy's connect-src, or the browser blocks the reports.
let ingestOrigin = '';
if (dsn) {
  try {
    ingestOrigin = new URL(dsn).origin;
  } catch {
    console.error('SENTRY_DSN is not a valid URL; browser error reporting is off.');
  }
}

module.exports = { Sentry, browserConfig: ingestOrigin ? browserConfig : null, ingestOrigin };
