$(function() {
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
            }, 8000);
        },

        stop: function() {
            if (this.thread) {
                clearInterval(this.thread);

                this.thread = undefined;
            }
        }
    };

    setTimeout(function() {
        $('#welcome2').remove();
        $('#welcome-content').css({
            opacity: 1
        });

        var slider = new SlideShow($('.js-slider'));
    }, 3000);


});