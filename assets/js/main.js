$('#testimonial-carousel .next-button').click(function () {
    let wrapper = $('#testimonial-carousel ul');
    let firstItem = wrapper.children('li').first();
    firstItem.animate({ marginLeft: -firstItem.width() }, 300, 'swing', function () {
        firstItem.detach();
        firstItem.css("margin-left", 0);
        firstItem.appendTo(wrapper);
    });
});

$('#testimonial-carousel .prev-button').click(function () {
    let wrapper = $('#testimonial-carousel ul');
    let lastItem = wrapper.children('li').last();
    let w = lastItem.width();
    lastItem.detach();
    lastItem.css("margin-left", -w);
    lastItem.prependTo(wrapper);
    lastItem.animate({ marginLeft: 0 }, 300, 'swing');
});

$('#nav-dropdown-btn').click(function () {
    let menu = $('#nav-dropdown-menu');
    let btnIconBars = $('#nav-dropdown-btn-icon-bars');
    let btnIconTimes = $('#nav-dropdown-btn-icon-times');
    if (menu.hasClass('hidden')) {
        menu.addClass('block');
        menu.removeClass('hidden');
        btnIconTimes.removeClass('hidden');
        btnIconBars.addClass('hidden');
    } else {
        menu.addClass('hidden');
        menu.removeClass('block');
        btnIconBars.removeClass('hidden');
        btnIconTimes.addClass('hidden');
    }
});
