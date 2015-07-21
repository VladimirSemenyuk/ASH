var _ = require('lodash'),
    fs = require('fs-extra'),
    path = require('path');

var Instrument = function(serial, model) {
    this.id = serial;
    this.serial = serial;
    this.model = model;
};

Instrument.prototype = {
    path: function() {
        return path.join('data/instruments/' + this.id + '_instrument.json');
    },

    save: function() {
        if (_.where(ash.instruments, {id: this.id}).length) {
            throw new Error('Инструмент уже существует');
        }

        var pagesData = JSON.parse(fs.readFileSync(this.path()));

        pagesData.push(this);

        fs.writeFileSync(this.path(), JSON.stringify(pagesData, null, 2));

        console.log('Инструмент', this.serial, 'создан');

        return this;
    }
};

module.exports = Instrument;