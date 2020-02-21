module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            dist: {
                src: ['src/js/jquery-1.12.4.min.js', 'src/js/jquery-migrate-1.4.1.min.js', 'src/js/jquery.mobile-1.2.1.min.js', 'src/js/jqm.page.params.js', 'src/js/Markdown.Converter.js', 'src/js/Markdown.Sanitizer.js', 'src/js/underscore-min.js', 'src/js/l10n.js', 'src/js/thermomix-main.js', 'src/js/thermomix-data.js', 'src/js/thermomix-controller.js', 'src/js/thermomix-views.js' ],
                dest: 'dist/js/thermomix-recipes.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! Thermomix-recipes - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                    '* https://github.com/paulgreg/thermomix-recipes/\n' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
                    'Grégory PAUL; Licensed GPLv2 */'
            },
            dist: {
                files: {
                    'dist/js/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        qunit: {
            files: ['tests/*.html']
        },
        jshint: {
            files: ['Gruntfile.js', 'src/js/thermomix-*.js'],
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                browser: true,
                globals: {
                    '$': true,
                    'jQuery': true,
                    '_': true,
                    'alert': true,
                    'confirm': true,
                    'xhr': true,
                    'module': true,
                    'console': true,
                    'Markdown': true
                }
            },
        },
        watch: {
            files: '<jshint.files>',
            tasks: ['jshint', 'qunit']
        }
    });

    // Default task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('test', ['jshint', 'qunit']);

    grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);

};
