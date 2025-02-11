window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }

$('a').each(function() {
  const $a = $(this);
  if ($a[0].host !== window.location.host && !$a.attr('data-umami-event')) {
    $a.attr('data-umami-event', 'outbound-link-click');
    $a.attr('data-umami-event-url', $a.attr('href'));
  }
});

function determineGitHubStargazersCount(locale, globalData) {
  $.getJSON('https://api.cryptomator.org/desktop/repo.json', data => {
    globalData.githubStargazers = formatNumber(data.stargazers_count, locale);
  }).fail(() => {
    console.error('Error fetching repository data.');
  });
  function formatNumber(num, locale) {
    let formatted = num;
    if (num >= 1000 && num < 1000000) {
      formatted = (num / 1000).toFixed(1);
      formatted = formatted.endsWith('.0') ? formatted.slice(0, -2) + 'k' : formatted + 'k';
    } else if (num >= 1000000) {
      formatted = (num / 1000000).toFixed(1);
      formatted = formatted.endsWith('.0') ? formatted.slice(0, -2) + 'M' : formatted + 'M';
    }
    if (locale === 'de') {
      return formatted.replace('.', ',');
    } else {
      return formatted;
    }
  }
}
