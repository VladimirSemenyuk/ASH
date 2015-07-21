var _ = require('lodash');

var Page = require('../classes/Page.js');

/*var WelcomePage = function() {
    Page.apply(this, arguments);


};

WelcomePage.prototype = new Page();*/


var PageGenerator = function() {

};

PageGenerator.prototype = {
    create: function(name, nameRus, templateName) {
        if (!name) {
            throw new Error('Требуется указать английское название страницы');
        }

        if (!nameRus) {
            throw new Error('Требуется указать русское имя страницы');
        }

        if (!templateName) {
            throw new Error('Требуется указать имя шаблона страницы');
        }

        if (!templateName) {
            throw new Error('Требуется указать имя шаблона страницы (' + JSON.stringify(ash.templates) + ')');
        }

        var template = _.filter(ash.templates, function(template) {
            return template === templateName;
        })[0];

        if (!template) {
            throw new Error('Такого шаблона нет (' + JSON.stringify(ash.templates) + ')');
        }

        return (new Page(name, nameRus, templateName)).save();
    }
}

module.exports = new PageGenerator();