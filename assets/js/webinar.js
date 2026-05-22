"use strict";

class Webinar {

  constructor(webinarId, lang, languageNames, data) {
    $.getJSON(`${API_BASE_URL}/connect/contact/webinar/${webinarId}`).done(d => {
      data.name = d.name;
      data.status = d.status;
      data.language = languageNames[d.language];
      data.dateStart = d.dateStart.replace(' ', 'T') + 'Z';
      data.lead = d.metadata.lead[lang];
      data.learnTitle = d.metadata.learn.title[lang];
      data.learnItems = (d.metadata.learn.items).map(i => i[lang]);
    }).fail(xhr => {
      console.error('Fetching webinar data failed:', xhr.responseJSON?.message || xhr.statusText);
    });
  }

  static formatBerlin(iso, opts) {
    return new Intl.DateTimeFormat(document.documentElement.lang || 'en', { timeZone: 'Europe/Berlin', ...opts }).format(new Date(iso));
  }

}
