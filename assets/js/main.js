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
