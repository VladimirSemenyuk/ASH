require('./utils.js');
var fs = require('fs-extra'),
    _ = require('lodash');

function create(dataFile, Constr) {
    var res = [],
        data;

    try {
        data = JSON.parse(fs.readFileSync('data/' + dataFile + '.json'));
    } catch(e) {
        console.log(e)

        fs.writeFileSync('data/' + dataFile + '.json', '[]');
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
    contentPages: pages,
    instruments: instruments,
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