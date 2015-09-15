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

var Instrument = function(data) {
    var I = function() {
        _.extend(this, data);
    };

    I.prototype = new Page(data.id, data.id, 'instrumentPage');
    I.prototype.path = p;
    I.prototype.save = save;

    return new I();
};

module.exports = Instrument;