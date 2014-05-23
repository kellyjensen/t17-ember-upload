module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-es6-module-transpiler');
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.initConfig({
        transpile: {
            amd: {
                type: "amd",
                files: [{
                      expand: true,
                      cwd: 'lib/',
                      src: ['**/*.js'],
                      dest: 'tmp/',
                  }]
            }
        },
        concat: {
            amd: {
                src: "tmp/**/*.js",
                dest: "dist/t17-ember-upload.js"
            }
        },
        cssmin: {
            minify: {
                expand: true,
                cwd: 'lib/',
                src: ['*.css', '!*.min.css'],
                dest: 'dist',
                ext: '.min.css'
            }
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['lib/*.png'],
                    dest: 'dist/',
                    filter: 'isFile'
                }]
            }
        }
    });

    grunt.registerTask('dist', ['transpile', 'concat', 'cssmin', 'copy']);
};
