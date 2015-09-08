$(function() {
    $('#logo').on('click', function() {
        location.href = '/';
    });

    var $body = $('body');

    $('.model-list__item').on('click', function(e) {
        location.href = $(this).data('href');
    }).one('mouseenter', function(e) {
        var hint =document.createElement("link");

        hint.setAttribute('rel', 'prerender');
        hint.setAttribute('href', $(this).data('href'));

        document.getElementsByTagName('head')[0].appendChild(hint);
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

    var prefetch = function(href) {
        var hint = document.createElement("link");

        hint.setAttribute('rel', 'prefetch');
        hint.setAttribute('href', href);

        document.getElementsByTagName('head')[0].appendChild(hint);
    };

    if (window.prefetched && window.prefetched.length) {
        for (var i = 0; i < window.prefetched.length; i++) {
            prefetch(window.prefetched[i]);
        }
    }
});