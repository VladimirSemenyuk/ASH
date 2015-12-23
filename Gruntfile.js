var proc = require('child_process');
var fs = require('fs-extra');
var _ = require('lodash');
var Validator = require('jsonschema').Validator;
var v = new Validator();
v.attributes.ofList = function validateofList(instance, schema, options, ctx) {
    if(schema.ofList.indexOf(instance)<0){
        return 'value should be of ' + JSON.stringify(schema.ofList);
    }
}

module.exports = function(grunt) {
    "use strict";

    var imgFiles = {},
        originalFiles = {};

    var files = grunt.file.expand('data/instruments/**/g*.jpg');

    for (var i = 0; i < files.length; i++) {
        originalFiles[files[i].replace('data/instruments/', 'output/img/')] = files[i];
    }

    for (i = 0; i < files.length; i++) {
        imgFiles[files[i].replace('/g', '/small/g').replace('data/instruments/', 'output/img/')] = files[i];
    }

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            server: {
                options: {
                    port: 7000,
                    hostname: '*',
                    base: {
                        path: 'output',
                        options: {
                            index: 'index.html',
                            maxAge: 1000
                        }
                    },
                    keepalive: true
                }
            }
        },
        image: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: '',
                    src: ['img/**/*.{png,jpg,gif,svg}'],
                    dest: 'output/'
                }]
            }
        },
        image_resize: {
            resize: {
                options: {
                    width: 400,
                    height: 400,
                    crop: true
                },
                files: imgFiles
            },
            resizeOriginal: {
                options: {
                    width: 1500,
                    height: 1500,
                    crop: false
                },
                files: originalFiles
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-image-resize');

    grunt.task.registerTask('default', [
        'compile',
        'image',
        'copy_previews'
    ]);

    grunt.task.registerTask('copy_images', function() {
        var files = grunt.file.expand(['img/**/*']);

        for (var i = 0; i < files.length; i++) {
            fs.copySync(files[i], 'output/' + files[i]);
        }

        files = grunt.file.expand(['data/instruments/**/g*']);

        for (i = 0; i < files.length; i++) {
            var file = files[i].replace('data/instruments/', ''),
                fileArr = file.split('/');

            fs.copySync(files[i], 'output/img/' + file);
            fs.copySync(files[i], 'output/img/' + fileArr.join('/small/'));
        }
    });

    grunt.task.registerTask('copy_previews', function() {
        var folders = fs.readdirSync('data/instruments').sort();

        for (var i = 0; i < folders.length; i++) {
            if (folders[i].indexOf('.DS')!== -1) {
                continue;
            }

            let folder = 'data/instruments/' + folders[i],
                dest = 'output/img/' + folders[i];

            try {
                fs.copySync(folder + '/preview.jpg', dest + '/preview.jpg');
            } catch (e) {

            }

            try {
                fs.copySync(folder + '/preview.2x.jpg', dest + '/preview.2x.jpg');
            } catch (e) {

            }

            try {
                fs.copySync(folder + '/list.jpg', dest + '/list.jpg');
            } catch (e) {

            }

            try {
                fs.copySync(folder + '/list.2x.jpg', dest + '/list.2x.jpg');
            } catch (e) {

            }

            grunt.log.ok('Previews from ' + folder + ' were copied.');
        }
    });

    grunt.task.registerTask('pdf', function() {
        var files = grunt.file.expand('output/print/en/**/*.html');

        return proc.execSync('phantomjs service/rasterize.js ' + files.join(','));
    });

    grunt.task.registerTask('compile', function() {
        return proc.execSync('node service/index.js compile');
    });

    grunt.task.registerTask('remove_print', function() {
        fs.removeSync('output/print');
    });

    function testJson(json, schema, path) {
        return function() {
            var res = v.validate(json, schema);

            for (var i = 0; i < res.errors.length; i++) {
                grunt.log.error(path + ':', res.errors[i].stack);
            }

            return res.errors.length ? 1 : 0;
        }
    }

    function testFiles(prefix, files) {
        if (!(files instanceof Array)) {
            files = [files];
        }

        return function() {
            for (var i = 0; i < files.length; i++) {
                if (!grunt.file.exists(prefix + '/' + files[i])) {
                    grunt.log.error('File ' + files[i] + ' doesn`t exists in ' + prefix);

                    return 1;
                }
            }
        }
    }

    grunt.task.registerTask('test', function() {
        var config = grunt.file.readJSON('data/config.json');
        var models = grunt.file.readJSON('data/models.json');
        var pages = grunt.file.readJSON('data/pages.json');

        var instrumentSchema = {
            "id": "/InstrumentsSchema",
            "type": "object",
            "properties": {
                "id": {"type": "number"},
                "model": {"type": "string", ofList: _.pluck(models, 'id')},
                "video": {"type": "string"},
                "type": {"type": "string", ofList: ['guitar', 'bass']},
                "images": {
                    type: "object",
                    properties: {
                        "list": {"type": "string"},
                        "list2x": {"type": "string"},
                        "preview": {"type": "string"},
                        "preview2x": {"type": "string"},
                        "gallery": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    },
                    "required": ["list", "list2x", "gallery"]
                },
                "description":{"type": "string"},
                "specs":  {
                    type: "object",
                    properties: {
                        "scaleLength": {"type": "string"},
                        "fretsCount": {"type": "string"},
                        "stringsCount": {"type": "string"},
                        "fingerboardRadius": {"type": "string"},
                        "bodyWood": {"type": "string"},
                        "topWood": {"type": "string"},
                        "neckWood": {"type": "string"},
                        "construction": {"type": "string"},
                        "fingerboardWood": {"type": "string"},
                        "dots": {"type": "string"},
                        "nut": {"type": "string"},
                        "hardwareColor": {"type": "string"},
                        "tuners": {"type": "string"},
                        "bridge": {"type": "string"},
                        "pickups": {
                            "type": "array",
                            "items": {"type": "string"}
                        },
                        "pickup": {"type": "string"},
                        "preamp": {"type": "string"},
                        "electronics": {"type": "string"},
                        "knobs": {"type": "string"},
                        "switching": {
                            "type": "array",
                            "items": {"type": "string"}
                        },
                        "color": {"type": "string"},
                        "finish": {"type": "string"}
                    }
                }
            },
            "required": ["id", "model", "type", "images", "specs"]
        };

        var tests = [
            testJson(config, {
                "id": "/ConfigSchema",
                "type": "object",
                "properties": {
                    "siteTitle": {"type": "string"},
                    "mainVideo": {"type": "string"},
                    welcomeSlideshow: {
                        "type": "array",
                        "items": {"type": "string"}
                    }
                },
                "required": ["siteTitle", "mainVideo", "welcomeSlideshow"]
            }, 'data/config.json'),
            testFiles('data/instruments', config.welcomeSlideshow),

            testJson(pages, {
                "id": "/PagesSchema",
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "id": {"type": "string"},
                        "name": {"type": "string"},
                        "templateName": {"type": "string"}
                    },
                    "required": ["id", "name", "templateName"]
                }
            }, 'data/config.json'),
            testFiles('service/templates', _.map(pages, function(page) {
                return page.templateName + '.jade';
            })),

            testJson(models, {
                "id": "/ModelsSchema",
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "id": {"type": "string"},
                        "name": {"type": "string"},
                        "type": {"type": "string", ofList: ['guitar', 'bass']},
                        "sampleInstrument": {"type": "number"}
                    },
                    "required": ["id", "name", "type", "sampleInstrument"]
                }
            }, 'data/models.json'),
            testFiles('data/instruments', _.map(models, function(model) {
                return model.sampleInstrument + '/specs.json';
            }))
        ];

        _.forEach(grunt.file.expand(['data/instruments/*'], {
            filter: 'isDirectory'
        }), function(instrumentFolder) {
            var instrument = grunt.file.readJSON(instrumentFolder + '/specs.json');

            tests.push(testJson(instrument, instrumentSchema, instrumentFolder + '/specs.json'));
            tests.push(testFiles(instrumentFolder, instrument.images.list));
            tests.push(testFiles(instrumentFolder, instrument.images.list2x));
            tests.push(testFiles(instrumentFolder, instrument.images.preview));
            tests.push(testFiles(instrumentFolder, instrument.images.preview2x));
            tests.push(testFiles(instrumentFolder, instrument.images.gallery));
        });

        var flag = 0;

        for (var i = 0; i < tests.length; i++) {
            if (tests[i]()) {
                flag = 1;
            }
        }

        if (flag) {
            grunt.fail.fatal('Tests failed');
        }
    });

    grunt.loadNpmTasks('grunt-image');

};