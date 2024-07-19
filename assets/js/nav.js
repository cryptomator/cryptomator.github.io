function determineGitHubStargazersCount(locale) {
  $.getJSON('https://api.cryptomator.org/desktop/repo.json', data => {
    $('#github-stargazers').text(formatNumber(data.stargazers_count, locale));
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
