var _ = require('lodash');

var Instrument = require('../classes/Instrument.js');

var InstrumentGenerator = function() {

};

InstrumentGenerator.prototype = {
    create: function(serial, model) {
        if (!serial) {
            throw new Error('Требуется указать серийный номер иснтрумента');
        }

        if (!model) {
            throw new Error('Требуется указать модель иснтрумента (' + JSON.stringify(_.map(ash.models, function(model) {
                    return model.id;
                })) + ')');
        }

        var modelInstance = _.where(ash.models, {id: model})[0];

        if (!modelInstance) {
            throw new Error('Такая модель отсутсвует');
        }

        return (new Instrument(serial, model)).save();
    }
}

module.exports = new InstrumentGenerator();