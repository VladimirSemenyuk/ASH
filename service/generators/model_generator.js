var Model = require('../classes/Model.js');

var ModelGenerator = function() {

};

ModelGenerator.prototype = {
    create: function(name, type) {
        if (!name) {
            throw new Error('Требуется указать название модели');
        }

        if (!type) {
            throw new Error('Требуется указать тип модели (guitar / bass)');
        }

        return (new Model(name, type)).save();
    }
}

module.exports = new ModelGenerator();