$(function() {
    $('#logo').on('click', function() {
        location.href = '/';
    });

    $('.model-list__item').on('click', function(e) {
        location.href = $(this).data('href');
    });

    $('.model-scroller').mCustomScrollbar({
        axis:"x",
        theme: "dark",
        mouseWheel:{
            enable: false
        }
    });

    var year = 2015,
        date = new Date();

    if (date.getFullYear() !== year) {
        year += ' &mdash; ' + date.getFullYear();
    }

    $('.year').html(year);
});