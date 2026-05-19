"use strict";

window.formatBerlin = (iso, opts) =>
  new Intl.DateTimeFormat(document.documentElement.lang || 'en', { timeZone: 'Europe/Berlin', ...opts }).format(new Date(iso));
