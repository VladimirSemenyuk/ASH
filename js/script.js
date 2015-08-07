$(function() {
    $('#logo').on('click', function() {
        location.href = '/';
    });

    $('.model-list__item').on('click', function(e) {
        location.href = $(this).data('href');
    });
});