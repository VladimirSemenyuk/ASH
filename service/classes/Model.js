var _ = require('lodash'),
    fs = require('fs-extra'),
    path = require('path');

var Model = function(name, type) {
    this.id = name.toUnderscore();

    this.name = name;
    this.type = type;

    this.images = {
        previewImage: 'img/' + this.name + '/preview.jpg'
    }
};

Model.prototype = {
    path: function() {
        return path.join('data/models.json');
    },

    save: function() {
        if (_.where(ash.models, {id: this.id}).length) {
            throw new Error('Модель уже существует');
        }

        var pagesData = JSON.parse(fs.readFileSync(this.path()));

        pagesData.push(this);

        fs.writeFileSync(this.path(), JSON.stringify(pagesData, null, 2));

        fs.mkdirSync('img/' + this.name);

        console.log('Модель', this.name, 'создана');

        return this;
    }
};

module.exports = Model;