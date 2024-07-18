if (window.location.hash == '#donate') {
  window.location.replace('/donate/');
}

$('#testimonial-carousel .next-button').on('click', () => {
  let wrapper = $('#testimonial-carousel ul');
  let firstItem = wrapper.children('li').first();
  firstItem.animate({ marginLeft: -firstItem.width() }, 300, 'swing', () => {
    firstItem.detach();
    firstItem.css('margin-left', 0);
    firstItem.appendTo(wrapper);
  });
});

$('#testimonial-carousel .prev-button').on('click', () => {
  let wrapper = $('#testimonial-carousel ul');
  let lastItem = wrapper.children('li').last();
  let w = lastItem.width();
  lastItem.detach();
  lastItem.css('margin-left', -w);
  lastItem.prependTo(wrapper);
  lastItem.animate({ marginLeft: 0 }, 300, 'swing');
});

$(() => {
  $.getJSON('https://api.github.com/repos/cryptomator/cryptomator', data => {
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
