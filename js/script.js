$(function() {
    $('#logo').on('click', function() {
        location.href = '/';
    });

    var $body = $('body');

    $('.model-list__item').on('click', function(e) {
        location.href = $(this).data('href');
    }).one('mouseenter', function(e) {
        $body.append('<link rel="prerender" href="'+$(this).data('href')+'">');
    });

    $('.model-scroller').mCustomScrollbar({
        axis:"x",
        theme: "dark",
        mouseWheel:{
            enable: false
        }
    });

    var year = 2015,
        date = new Date(),
        fullDate = date.getFullYear() + '.' + (date.getMonth() +1) + '.' + date.getDate() + ' - ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

    if (date.getFullYear() !== year) {
        year += ' &mdash; ' + date.getFullYear();
    }

    $('.year').html(year);

    $('#order-title-field').val('New Order! [' + fullDate + ']');
});