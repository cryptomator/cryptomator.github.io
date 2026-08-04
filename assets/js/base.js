$('a').each(function() {
  const $a = $(this);
  if ($a[0].host !== window.location.host && !$a.attr('data-umami-event')) {
    $a.attr('data-umami-event', 'outbound-link-click');
    $a.attr('data-umami-event-url', $a.attr('href'));
  }
});

(function removeUTMParams() {
  const url = new URL(window.location.href);
  const params = url.searchParams;
  const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  let modified = false;
  utmParams.forEach(param => {
    if (params.has(param)) {
      params.delete(param);
      modified = true;
    }
  });
  if (modified) {
    const newQuery = params.toString() ? '?' + params.toString() : '';
    const newUrl = url.pathname + newQuery + url.hash;
    window.history.replaceState({}, document.title, newUrl);
  }
})();

function determineGlobalData(locale, globalData) {
  determineGitHubStargazersCount(locale, globalData);
  determineMastodonFollowersCount(locale, globalData);
}

function determineGitHubStargazersCount(locale, globalData) {
  $.getJSON(`${API_BASE_URL}/connect/social/github`, data => {
    globalData.githubStargazers = formatNumber(data.stargazers_count, locale);
  }).fail(() => {
    console.error('Error fetching repository data.');
  });
}

function determineMastodonFollowersCount(locale, globalData) {
  $.getJSON(`${API_BASE_URL}/connect/social/mastodon`, data => {
    globalData.mastodonFollowers = formatNumber(data.followers_count, locale);
  }).fail(() => {
    console.error('Error fetching Mastodon data.');
  });
}

function determineWebinarBanner(webinarId, lang, labels, webinar) {
  $.getJSON(`${API_BASE_URL}/connect/contact/webinar/${webinarId}`).done(d => {
    if (d.status !== 'Planned' || !d.dateStart) {
      webinar.state = 'none';
      return;
    }
    const start = new Date(d.dateStart.replace(' ', 'T') + 'Z');
    const end = d.dateEnd ? new Date(d.dateEnd.replace(' ', 'T') + 'Z') : null;
    const now = new Date();
    if (end && now >= end) {
      webinar.state = 'none';
      return;
    }
    webinar.name = d.name;
    webinar.dateStart = start.toISOString();
    if (now >= start) {
      webinar.state = 'live';
      webinar.label = labels.live.replace('%NAME%', d.name);
    } else {
      webinar.state = 'upcoming';
      webinar.label = labels.upcoming.replace('%NAME%', d.name).replace('%WHEN%', formatWebinarWhen(start, lang));
    }
  }).fail(xhr => {
    console.error('Fetching webinar banner data failed:', xhr.responseJSON?.message || xhr.statusText);
  });
}

function formatWebinarWhen(date, lang) {
  return new Intl.DateTimeFormat(lang || 'en', {
    timeZone: 'Europe/Berlin',
    month: 'long', day: 'numeric',
    hour: 'numeric', minute: '2-digit', timeZoneName: 'short'
  }).format(date);
}

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
