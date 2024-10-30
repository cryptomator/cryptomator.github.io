window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }
document.addEventListener('DOMContentLoaded', function () { plausible('404', { props: { path: document.location.pathname } }); });
