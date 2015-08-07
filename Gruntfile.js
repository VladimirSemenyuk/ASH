var proc = require('child_process');

module.exports = function(grunt) {

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
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.task.registerTask('default', [
        'compile',
        'image'
    ]);

    grunt.task.registerTask('compile', function() {
        return proc.execSync('node service/index.js compile');
    });

    grunt.loadNpmTasks('grunt-image');

};