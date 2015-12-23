var _ = require('lodash'),
    fs = require('fs-extra'),
    jade = require('jade'),
    path = require('path');

var Page = function(name, nameRus, templateName) {
    this.id = (name + '').toUnderscore();

    this.name = name;
    this.nameRus = nameRus;
    this.templateName = templateName;

    var data = JSON.parse(fs.readFileSync('data/config.json'));
    this.welcomeSlideshow = data.welcomeSlideshow;
    this.mainVideo = data.mainVideo;
};

Page.prototype = {
    path: function() {
        return path.join('data/pages.json');
    },

    templatePath: function() {
        if (this.templateName.indexOf('.md') !== -1) {
            return path.join('service/templates/' + this.templateName);
        }

        return path.join('service/templates/' + this.templateName + '.jade');
    },

    templatePrintPath: function() {
        return path.join('service/templates/' + this.templateName + 'Print.jade');
    },

    save: function() {
        if (_.where(ash.pages, {id: this.id}).length) {
            throw new Error('Страница уже существует');
        }

        var pagesData = JSON.parse(fs.readFileSync(this.path()));

        pagesData.push(this);

        fs.writeFileSync(this.path(), JSON.stringify(pagesData, null, 2));

        console.log('Страница', this.name, 'создана');

        return this;
    },

    template: function(lang) {
        if (this.templateName.indexOf('.md') !== -1) {
            var markdown = require('jstransformer')(require('jstransformer-markdown'));

            return markdown.render(fs.readFileSync(this.templatePath()).toString()).body;
        }

        var options = _.extend({
            lang: lang
        }, this);

        return jade.renderFile(this.templatePath(), options);
    },

    templatePrint: function(lang) {
        var options = _.extend({
            lang: lang
        }, this);

        return jade.renderFile(this.templatePrintPath(), options);
    }
};

module.exports = Page;