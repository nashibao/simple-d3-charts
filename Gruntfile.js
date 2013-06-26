var proc = require('child_process');
var growl = require('growl');


module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    coffee: {
        glob_to_multiple: {
          expand: true,
          cwd: './',
          src: ['**/*.coffee'],
          dest: './',
          ext: '.js',
          options: {
            bare: true
          }
        }
    },
    watch: {
        files: ['**/*.coffee', '**/*.jade'],
        tasks: ['coffee', 'shell', 'jade']
    },
    shell: {
      componentCompile: {
        command: 'make;'
      }
    },
    jade: {
      compile: {
        files: {
          "index.html": "index.jade"
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-contrib-jade');

  // Default task(s).
  grunt.registerTask('default', ['coffee', 'shell', 'jade']);

};