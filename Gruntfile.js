module.exports = function(grunt) {
	'use strict';

	grunt.initConfig({

		path: require('path'),

		pkg: grunt.file.readJSON('package.json'),

		clean: ["docs/"],

		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			dist: {
				files: {
					'js/app.min.js': ['js/app.js']
				}
			}
		},

		jasmine: {
			cryptomatorWeb: {
				src: ['js/app.js'],
				options: {
					vendor: ['http://cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.compat.min.js', 'http://cdnjs.cloudflare.com/ajax/libs/angular.js/1.4.8/angular.js', 'http://cdnjs.cloudflare.com/ajax/libs/angular.js/1.4.8/angular-cookies.js', 'https://code.angularjs.org/1.4.8/angular-mocks.js', 'http://code.jquery.com/jquery-2.1.1.min.js', 'http://java.com/js/deployJava.js'],
					specs: 'tests/**/*spec.js',
					helpers: 'tests/**/*helper.js'
				}
			}
		},

		jshint: {
			files: ['Gruntfile.js', 'js/app.js', 'tests/**/*.js'],
			options: {
				globals: {
					jQuery: true,
					console: true,
					module: true,
					document: true
				}
			}
		},

		connect: {
			livereload: {
				options: {
					port: 9000,
					hostname: 'localhost',
					livereload: true
				}
			}
		},

		open: {
			livereload: {
				path: 'http://localhost:<%= connect.livereload.options.port %>/'
			}
		},

		watch: {
			livereload: {
				files: ['*.html', 'js/**/*.js', 'partials/**', 'css/**'],
				options: {livereload: true}
			}
		}

	});


	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-open');

	grunt.registerTask('test', [
		'jshint',
		'jasmine'
	]);

	grunt.registerTask('default', [
		'clean',
		'jshint',
		'jasmine',
		'uglify'
	]);

	grunt.registerTask('serve',[
		'connect:livereload',
		'open:livereload',
		'watch:livereload'
	]);

};
