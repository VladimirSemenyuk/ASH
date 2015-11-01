var fs = require('fs-extra'),
    jade = require('jade'),
    _ = require('lodash');

module.exports = {
    compile: function(lang) {

        try {
            fs.mkdirSync('output/' + lang);
        } catch(e) {

        }

        try {
            fs.mkdirSync('output/' + lang +'/guitars');
        } catch(e) {

        }

        try {
            fs.mkdirSync('output/' + lang +'/basses');
        } catch(e) {

        }

        for (var i = 0; i < ash.guitarModels.length; i++) {
            var model = ash.guitarModels[i];

            model._ash = ash;

            //model.instruments = _.where(ash.instruments, {model: model});

            //var href = model.href = 'guitars/' + model.id + '.html';

            var data = JSON.parse(fs.readFileSync('data/config.json')),
                html = jade.renderFile('service/templates/main.jade', {
                    lang: lang,
                    currentPage: model.name,
                    pretty: true,
                    title: data.siteTitle + ' &mdash; ' + model.name,
                    pages: ash.contentPages,
                    content: model.template(lang)
                });

            fs.writeFileSync('output/' + lang + model.href, html);
            fs.mkdirSync('output/' + lang +'/guitars/' + model.id);
        }

        for (var i = 0; i < ash.bassModels.length; i++) {
            var model = ash.bassModels[i];

            model._ash = ash;

            //model.instruments = _.where(ash.instruments, {model: model});

            //var href = model.href = 'basses/' + model.id + '.html';

            var data = JSON.parse(fs.readFileSync('data/config.json')),
                html = jade.renderFile('service/templates/main.jade', {
                    lang: lang,
                    currentPage: model.name,
                    pretty: true,
                    title: data.siteTitle + ' &mdash; ' + model.name,
                    pages: ash.contentPages,
                    content: model.template(lang)
                });

            fs.writeFileSync('output/' + lang + model.href, html);
            fs.mkdirSync('output/' + lang +'/basses/' + model.id);
        }

        try {
            fs.mkdirSync(lang + '/output/instruments');
        } catch(e) {

        }

        for (var i = 0; i < ash.instruments.length; i++) {
            var instrument = ash.instruments[i];

            instrument._ash = ash;

            //instrument.model = _.findWhere(ash.models, {id: instrument.model});

            var data = JSON.parse(fs.readFileSync('data/config.json')),
                html = jade.renderFile('service/templates/main.jade', {
                    lang: lang,
                    currentPage: instrument.name,
                    pretty: true,
                    title: data.siteTitle + ' &mdash; ' + instrument.model.name + ' &mdash; ' + instrument.id ,
                    pages: ash.contentPages,
                    images: instrument.images,
                    content: instrument.template(lang)
                });

            fs.writeFileSync('output/' + lang + instrument.href, html);

            console.log('CREATE: output/' + lang + instrument.href);
        }

        for (var i = 0; i < ash.pages.length; i++) {
            var page = ash.pages[i];

            page._ash = ash;

            var data = JSON.parse(fs.readFileSync('data/config.json')),
                html = jade.renderFile('service/templates/main.jade', {
                    lang: lang,
                    currentPage: page.name,
                    pretty: true,
                    title: data.siteTitle + ' &mdash; ' + page.name,
                    pages: ash.contentPages,
                    content: page.template(lang)
                });

            fs.writeFileSync('output/' + lang + '/' + page.id + '.html', html);

        }
    }
}