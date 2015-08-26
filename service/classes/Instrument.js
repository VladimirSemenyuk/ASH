var _ = require('lodash'),
    fs = require('fs-extra'),
    path = require('path');

var Page = require('./Page.js');

function p() {
    return path.join('data/instruments.json');
};

function save() {
    if (_.where(ash.instruments, {id: this.id}).length) {
        throw new Error('Инструмент уже существует');
    }

    var pagesData = JSON.parse(fs.readFileSync(this.path()));

    pagesData.push(this);

    fs.writeFileSync(this.path(), JSON.stringify(pagesData, null, 2));

    console.log('Инструмент', this.serial, 'создан');

    return this;
}

var Instrument = function(name, type) {
    var I = function() {
        this.id = (name + '').toUnderscore();

        this.name = name;
        this.type = type;

        this.images = {
            listImage: 'img/' + this.name + '/list.jpg'
        }

        this.href = "instruments/" + this.id + '.html';

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

    I.prototype = new Page(name, name, 'instrumentPage');
    I.prototype.path = p;
    I.prototype.save = save;

    return new I();
};

module.exports = Instrument;