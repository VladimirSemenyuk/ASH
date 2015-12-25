var fs = require('fs-extra'),
    jade = require('jade'),
    _ = require('lodash'),
    qr = require('qr-image');

module.exports = {
    compile: function(lang) {

        var dicts = fs.readJsonSync('service/dicts.json'),
            langs = ['en'];

        for (var l in dicts) {
            langs.push(l);
        }

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

        try {
            fs.mkdirSync('output/print');
        } catch(e) {

        }

        try {
            fs.mkdirSync('output/print/' + lang);
        } catch(e) {

        }

        try {
            fs.copySync('img/tree.png', 'output/print/' + lang + '/tree.png');
        } catch(e) {

        }

        try {
            fs.copySync('img/ash_instruments.png', 'output/print/' + lang + '/ash_instruments.png');
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
                    langs: langs,
                    currentPage: model.name,
                    pretty: true,
                    title: data.siteTitle + ' &mdash; ' + model.name,
                    pages: ash.contentPages,
                    content: model.template(lang),
                    href: model.href
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
                    langs: langs,
                    currentPage: model.name,
                    pretty: true,
                    title: data.siteTitle + ' &mdash; ' + model.name,
                    pages: ash.contentPages,
                    content: model.template(lang),
                    href: model.href
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
                    langs: langs,
                    currentPage: instrument.name,
                    id: instrument.id,
                    pretty: true,
                    title: data.siteTitle + ' &mdash; ' + instrument.model.name + ' &mdash; ' + instrument.id ,
                    pages: ash.contentPages,
                    images: instrument.images,
                    content: instrument.template(lang),
                    href: instrument.href
                });

            fs.writeFileSync('output/' + lang + instrument.href, html);
            fs.writeFileSync('output/print/' + lang + '/a4_' + instrument.id + '.html', jade.renderFile('service/templates/print.jade', {
                lang: lang,
                langs: langs,
                currentPage: instrument.name,
                id: instrument.id,
                pretty: true,
                title: data.siteTitle + ' &mdash; ' + instrument.model.name + ' &mdash; ' + instrument.id ,
                pages: ash.contentPages,
                images: instrument.images,
                content: instrument.templatePrint(lang),
                href: instrument.href
            }))
            fs.writeFileSync('output/print/' + lang + '/a5_' + instrument.id + '.html', jade.renderFile('service/templates/print.jade', {
                lang: lang,
                langs: langs,
                currentPage: instrument.name,
                id: instrument.id,
                pretty: true,
                title: data.siteTitle + ' &mdash; ' + instrument.model.name + ' &mdash; ' + instrument.id ,
                pages: ash.contentPages,
                images: instrument.images,
                content: instrument.templateA5(lang),
                href: instrument.href
            }));

            var qrPng = qr.image('http://www.ash-instruments.com/' + lang + instrument.href, {
                type: 'png',
                size: 12
            });
            qrPng.pipe(fs.createWriteStream('output/print/' + lang + '/' + instrument.id + '.png'));


            console.log('CREATE: output/' + lang + instrument.href);
        }

        for (var i = 0; i < ash.pages.length; i++) {
            var page = ash.pages[i];

            page._ash = ash;

            var data = JSON.parse(fs.readFileSync('data/config.json')),
                html = jade.renderFile('service/templates/main.jade', {
                    lang: lang,
                    langs: langs,
                    currentPage: page.name,
                    pretty: true,
                    title: data.siteTitle + ' &mdash; ' + ash.i18n(page.name, lang),
                    pages: ash.contentPages,
                    content: page.template(lang),
                    href: '/' + page.id + '.html'
                });

            fs.writeFileSync('output/' + lang + '/' + page.id + '.html', html);

        }
    }
}