/**
 * Created by vladimir on 14.07.15.
 */

$(function () {

    $('.nav_item').on('click', function(e) {

        var id = $(e.target).data('id');

        if (id) {
            $('.welcome').animate({
                top: '-100%',
                bottom: '100%',
                display: 'none'
            }, 1000);

            $('#' + id).show();
        }
    });
});


