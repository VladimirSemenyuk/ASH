var fs = require('fs-extra'),
    jade = require('jade'),
    _ = require('lodash');

module.exports = {
    compile: function() {
        for (var i = 0; i < ash.pages.length; i++) {
            var page = ash.pages[i];

            page._ash = ash;

            var data = JSON.parse(fs.readFileSync('data/config.json')),
                html = jade.renderFile('service/templates/main.jade', {
                    pretty: true,
                    title: data.siteTitle + ' &mdash; ' + page.name,
                    pages: ash.contentPages,
                    content: page.template()
                });

            fs.writeFileSync('output/' + page.id + '.html', html);
        }
    }
}