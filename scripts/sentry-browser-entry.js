// Source for shared/sentry.min.js, the Sentry browser SDK used by every tracker.
// Rebuild with `pnpm run build:sentry` after changing this file or updating
// @sentry/browser.
import { init, setTag } from '@sentry/browser';

// Set by /shared/sentry-config.js, which the server fills in from SENTRY_DSN.
const config = window.SNOO_TUBE_SENTRY;

if (config && config.dsn) {
  init({
    dsn: config.dsn,
    environment: config.environment,
    release: config.release,
    // Sentry v11 collects user info (including IP addresses), cookies, headers,
    // query strings and request bodies by default. All of it stays out of Sentry.
    dataCollection: {
      userInfo: false,
      cookies: false,
      httpHeaders: false,
      httpBodies: [],
      urlQueryParams: false,
    },
  });

  // Tag each error with the tracker it came from, e.g. "snooker" or "paris".
  const tracker = window.location.pathname.split('/')[1] || 'hub';
  setTag('tracker', tracker);
}
