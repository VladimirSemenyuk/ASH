var proc = require('child_process');

module.exports = function(grunt) {

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
        'image'
    ]);

    grunt.task.registerTask('compile', function() {
        return proc.execSync('node service/index.js compile');
    });

    grunt.loadNpmTasks('grunt-image');

};