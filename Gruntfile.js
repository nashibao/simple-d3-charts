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
        files: ['**/*.coffee'],
        tasks: ['coffee', 'shell']
    },
    shell: {
      componentCompile: {
        command: 'make;'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-notify');

  // Default task(s).
  grunt.registerTask('default', ['coffee', 'shell']);

};