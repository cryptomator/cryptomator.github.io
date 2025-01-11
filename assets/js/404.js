document.addEventListener('DOMContentLoaded', function () { plausible('404', { props: { path: document.location.pathname } }); });
umami.track('404', { path: document.location.pathname });
