var _ = require('lodash'),
    fs = require('fs-extra'),
    path = require('path'),
    jade = require('jade');

var Page = require('./Page.js');

function p() {
    return path.join('data/models.json');
};

function save() {
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

var Model = function(name, type) {
    var M = function() {
        this.id = (name + '').toUnderscore();

        this.name = name;
        this.type = type;

        this.images = {
            listImage: 'img/' + this.name + '/list.jpg'
        }

        if (type === 'guitar') {
            this.href = "guitars/" + this.name + '.html';
        } else {
            this.href = "basses/" + this.name + '.html';
        }

        this.specs = {
            serial: '',
            bodyWood: '',
            topWood: '',
            neckWood: '',
            fingerboardWood: '',
            fingerboardRadius: '',
            fretsCount: '',
            scaleLength: '',
            bridge: '',
            tuners: '',
            pickups: '',
            controls: ''
        };
    };

    M.prototype = new Page(name, name, 'modelPage');
    M.prototype.path = p;
    M.prototype.save = save;

    return new M();
};

module.exports = Model;