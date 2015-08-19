require('./utils.js');
var fs = require('fs-extra'),
    _ = require('lodash');

function create(dataFile, Constr) {
    var res = [],
        data;

    try {
        data = JSON.parse(fs.readFileSync('data/' + dataFile + '.json'));
    } catch(e) {
        console.log(e);

        //fs.writeFileSync('data/' + dataFile + '.json', '[]');
    }

    if (data) {
        for (var i = 0; i < data.length; i++) {
            var id = data[i].id,
                instance = new Constr(id);

            _.extend(instance, data[i]);

            res.push(instance);
        }
    }

    return res;
}

var pages = create('pages', require('./classes/Page.js')),
    instruments = create('instruments', require('./classes/Instrument.js'));

global.ash = {
    pages: pages,
    contentPages: _.filter(pages, function(page) {
        return page.id !== '404';
    }),
    instruments: instruments,
    availableInstruments: _.where(instruments, {isAvailable: true}),
    guitars: _.where(instruments, {type: 'guitar'}),
    basses: _.where(instruments, {type: 'bass'}),
    templates: _.map(fs.readdirSync('service/templates'), function(templateFile) {
        return templateFile.replace('.jade', '');
    })
};

var models = create('models', require('./classes/Model.js'));

ash.models = models;
ash.guitarModels = _.where(models, {type: 'guitar'});
ash.bassModels = _.where(models, {type: 'bass'});

for (var i = 0; i < instruments.length; i++) {
    instruments[i].model = _.where(models, {id: instruments[i].model})[0];

    if (instruments[i].model.type == 'guitar') {
        instruments[i].href = '/guitars/' + instruments[i].model.id + '/' + instruments[i].id + '.html';
    } else {
        instruments[i].href = '/basses/' + instruments[i].model.id + '/' + instruments[i].id + '.html';
    }
}

for (var j = 0; j < models.length; j++) {
    models[j].instruments = _.where(instruments, {model: models[j]});

    if (models[j].type == 'guitar') {
        models[j].href = '/guitars/' + models[j].id + '.html';
    } else {
        models[j].href = '/basses/' + models[j].id + '.html';
    }
}

var args = process.argv;

var generators = {
    pageGenerator: require('./generators/page_generator.js'),
    modelGenerator: require('./generators/model_generator.js'),
    instrumentGenerator: require('./generators/instrument_generator.js')
};

var compilers = {
    pageCompiler: require('./compilers/page_compiler.js')
};


if (args.length) {
    if (args[2] === 'compile') {
        fs.removeSync('output/*');
        fs.copySync('js', 'output/js');
        fs.copySync('css', 'output/css');
        fs.copySync('manifest.json', 'output/manifest.json');
        fs.copySync('browserconfig.xml', 'output/browserconfig.xml');
        fs.copySync('favicon.ico', 'output/favicon.ico');
        fs.writeFileSync('output/CNAME', 'ash-instruments.com');

        compilers.pageCompiler.compile();
    } else {
        for (var g in generators) {
            if (generators.hasOwnProperty(g) && g === args[3] + 'Generator') {
                try {
                    generators[g][args[2]](args[4], args[5], args[6]);
                } catch (e) {
                    console.error(e);
                }
            }
        }
    }
}
