$(() => {
  $.getJSON('https://api.cryptomator.org/desktop/repo.json', data => {
    $('#github-stargazers').text(formatNumber(data.stargazers_count));
  }).fail(() => {
    console.error('Error fetching repository data.');
  });
  function formatNumber(num) {
    if (num >= 1000 && num < 1000000) {
      const formatted = (num / 1000).toFixed(1);
      return formatted.endsWith('.0') ? formatted.slice(0, -2) + 'k' : formatted + 'k';
    } else if (num >= 1000000) {
      const formatted = (num / 1000000).toFixed(1);
      return formatted.endsWith('.0') ? formatted.slice(0, -2) + 'M' : formatted + 'M';
    }
    return num;
  }
});
