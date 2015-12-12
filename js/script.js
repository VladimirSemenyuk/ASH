function validateEmail(email) {
    if (!email || !email.length) {
        return 'Email should not be empty';
    }

    if (email.length > 50) {
        return 'Length should be less then 50 symbols';
    }

    var reg = /\S+@\S+\.\S+/;

    return (reg.test(email) ? false : 'Email is in invalid format');
}

function validateName(name) {
    if (name.length > 50) {
        return 'Length should be less then 50 symbols';
    }

    return false;
}

function validateText(text) {
    if (!text || !text.length) {
        return 'Order text should not be empty';
    }

    if (text.length > 2000) {
        return 'Length should be less then 2000 symbols';
    }

    return false;
}

$(function() {
    $('#logo').on('click', function() {
        location.href = '/';
    });

    var $inputs = {
        $formEmail: {
            $el: $('#form-email'),
            validate: validateEmail
        },
        $formName: {
            $el: $('#form-name'),
            validate: validateName
        },
        $formText: {
            $el: $('#form-text'),
            validate: validateText
        }
    };

    var $submit = $('#form-submit'),
        $errors = $('.error'),
        $preloader = $('#preloader');

    $submit.on('click', function(e) {
        e.preventDefault();

        $submit.hide();
        $errors.hide();
        $preloader.show();

        var errors = [];

        for (var i in $inputs) {
            if ($inputs.hasOwnProperty(i)) {
                var $input = $inputs[i].$el;

                var error = $inputs[i].validate($input.val());

                if (error) {
                    errors.push({
                        input: i,
                        error: error
                    });
                }
            }
        }

        if (!errors.length && !$('#gtcha').val()) {
            $.ajax({
                url: '//formspree.io/' + 'ashinstruments' + '@' + 'gmail.com',
                method: "POST",
                data: {
                    _subject: 'New Order!',
                    name: $inputs.$formName.$el.val(),
                    message: $inputs.$formText.$el.val()
                },
                dataType: "json"
            }).then(function() {
                var language = window.navigator.userLanguage || window.navigator.language;

                try {
                    language = language.split('-')[0].toLowerCase();
                } catch (e) {

                }

                if (language !== 'ru') {
                    language = 'en';
                }

                document.location.pathname = language + '/thanks.html';
            }).fail(function() {
                $('#error-main').show();
                //$submit.show();
                $preloader.hide();
            });
        }

        if (errors.length) {
            for (var e = 0; e < errors.length; e++) {
                $('#error-' + errors[e].input.replace('$', '')).text(errors[e].error).show();
            }

            $submit.show();
            $preloader.hide();
        }
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
            enable: true
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