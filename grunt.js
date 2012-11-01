/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '0.1.0',
      banner: '/*! Thermomix-recipes - v<%= meta.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* https://github.com/paulgreg/thermomix-recipes/\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
        'Grégory PAUL; Licensed GPLv2 */'
    },
    lint: {
      files: ['src/js/*.js']
    },
    qunit: {
      files: ['tests/*.html']
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>', 'src/js/jquery-1.8.2.min.js', 'src/js/jquery.mobile-1.2.0-rc.2.min.js', 'src/js/jqm.page.params.js', 'src/js/Markdown.Converter.js', 'src/js/Markdown.Sanitizer.js', 'src/js/underscore-min.js', 'src/js/thermomix-main.js', 'src/js/thermomix-data.js', 'src/js/thermomix-controller.js', 'src/js/thermomix-views.js' ],
        dest: 'dist/js/thermomix-recipes.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/js/thermomix-recipes.min.js'
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },
    jshint: {
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
        browser: true
      },
      globals: {
        jQuery: true
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'concat min');

};
