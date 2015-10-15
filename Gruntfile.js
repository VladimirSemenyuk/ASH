var proc = require('child_process');
var fs = require('fs-extra');

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
                fs.copySync(folder + '/preview.2x.jpg', dest + '/preview.2x.jpg');
            } catch (e) {
                
            }
            
            fs.copySync(folder + '/list.jpg', dest + '/list.jpg');
            fs.copySync(folder + '/list.2x.jpg', dest + '/list.2x.jpg');

            grunt.log.ok('Previews from ' + folder + ' were copied.');
        }
    });

    grunt.task.registerTask('compile', function() {
        return proc.execSync('node service/index.js compile');
    });

    grunt.loadNpmTasks('grunt-image');

};