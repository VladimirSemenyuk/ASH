function setCookie(name, value, options) {
    options = options || {};

    var expires = options.expires;

    if (typeof expires == "number" && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    var updatedCookie = name + "=" + value;

    for (var propName in options) {
        updatedCookie += "; " + propName;
        var propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        }
    }

    document.cookie = updatedCookie;
}

// возвращает cookie с именем name, если есть, если нет, то undefined
function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

var SlideShow = function(el) {
    var items = el.find('.js-slide'),
        $nextBtn = el.find('.js-next'),
        $prevBtn = el.find('.js-prev');

    var self= this;

    $nextBtn.on('click', function() {
        self.stop();
        self.next();
        self.start();
    });

    $prevBtn.on('click', function() {
        self.stop();
        self.prev();
        self.start();
    });

    this.items = items;
    this.dots = el.find('.js-dots');

    el.find('.js-slider-dot').on('click', function(e) {
        self.stop();
        self.setIndex($(e.target).data('id'));
        self.start()
    });

    this.index = 0;
    this.currentItem = $(items[0]);

    this.currentItem.animate({
        opacity: 1
    });

    this.start();
};

SlideShow.prototype = {
    setIndex: function(index) {
        var prevItem = this.currentItem;

        this.index = index;

        this.currentItem = $(this.items[this.index]);

        this.currentItem.animate({
            opacity: 1
        }, 300);

        prevItem.animate({
            opacity: 0
        }, 300);

        this.checkDot();
    },
    next: function() {
        var prevItem = this.currentItem;

        if (this.index >= this.items.length -1) {
            this.index = 0;
        } else {
            this.index ++;
        }

        this.currentItem = $(this.items[this.index]);

        this.currentItem.animate({
            opacity: 1
        }, 300);

        prevItem.animate({
            opacity: 0
        }, 300);

        this.checkDot();
    },

    prev: function() {
        var prevItem = this.currentItem;

        if (this.index <= 0) {
            this.index = this.items.length - 1;
        } else {
            this.index--;
        }

        this.currentItem = $(this.items[this.index]);

        this.currentItem.animate({
            opacity: 1
        }, 300);

        prevItem.animate({
            opacity: 0
        }, 300);

        this.checkDot();
    },

    checkDot: function() {
        this.dots.children().removeClass('active');

        this.dots.find('[data-id=' + this.index + ']').addClass('active');
    },

    start: function() {
        var self = this;

        this.stop();

        this.checkDot();

        this.thread = setInterval(function() {
            self.next();
        }, 4000);
    },

    stop: function() {
        if (this.thread) {
            clearInterval(this.thread);

            this.thread = undefined;
        }
    }
};

function start() {
    $('#welcome2').remove();
    $('#welcome-content').css({
        opacity: 1
    });

    var slider = new SlideShow($('.js-slider'));

    setCookie('hasVisited', true, {
        expires: 0
    });
}

$(function() {
    if (!getCookie('hasVisited')) {
        setTimeout(start, 6000);
    } else {
        start();
        $('.welcome-style').remove();
    }
});