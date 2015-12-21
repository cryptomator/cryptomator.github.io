module.exports = function(grunt) {
	'use strict';

	grunt.initConfig({

		path: require('path'),

		pkg: grunt.file.readJSON('package.json'),

		clean: ["docs/"],

		/* JAVASCRIPT */

		uglify: {
			dev: {
        options: {
          mangle: false,
          compress: false,
          preserveComments: 'all',
          beautify: true
        },
				files: {
					'dist/bootstrap.min.js': ['js/bootstrap.js'],
					'dist/app.min.js': ['js/app.js']
				}
			},
			dist: {
				files: {
					'dist/bootstrap.min.js': ['js/bootstrap.js'],
					'dist/app.min.js': ['js/app.js']
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

		/* CSS */

		concat: {
			fakecssmin: {
				files: {
					'dist/index.min.css': ['css/bootstrap.css', 'css/main.css'],
					'dist/downloads.min.css': ['css/bootstrap.css', 'css/main.css'],
					'dist/datenschutz.min.css': ['css/bootstrap.css', 'css/main.css'],
					'dist/help.min.css': ['css/bootstrap.css', 'css/main.css'],
					'dist/impressum.min.css': ['css/bootstrap.css', 'css/main.css'],
					'dist/privacy.min.css': ['css/bootstrap.css', 'css/main.css'],
					'dist/thankyou.min.css': ['css/bootstrap.css', 'css/main.css']
	      }
			}
		},

		uncss: {
			options: {
				stylesheets: ['css/bootstrap.css', 'css/main.css'],
				ignore: []
			},
		  index: {
				options: {
					ignore: ['.col-md-3', '.open > .dropdown-menu']
				},
		    files: {'dist/index.css': ['index.html']}
		  },
			downloads: {
				options: {
					stylesheets: ['../css/bootstrap.css', '../css/main.css']
				},
		    files: {'dist/downloads.css': ['downloads/index.html']}
		  },
			datenschutz: {
		    files: {'dist/datenschutz.css': ['datenschutz.html']}
		  },
			help: {
		    files: {'dist/help.css': ['help.html']}
		  },
			impressum: {
		    files: {'dist/impressum.css': ['impressum.html']}
		  },
			privacy: {
		    files: {'dist/privacy.css': ['privacy.html']}
		  },
			thankyou: {
		    files: {'dist/thankyou.css': ['thankyou.html']}
		  }
		},

		cssmin: {
			dist: {
			  options: {
			    shorthandCompacting: false,
			    roundingPrecision: -1,
					keepSpecialComments: 0
			  },
				files: {
					'dist/index.min.css': ['dist/index.css'],
					'dist/downloads.min.css': ['dist/downloads.css'],
					'dist/datenschutz.min.css': ['dist/datenschutz.css'],
					'dist/help.min.css': ['dist/help.css'],
					'dist/impressum.min.css': ['dist/impressum.css'],
					'dist/privacy.min.css': ['dist/privacy.css'],
					'dist/thankyou.min.css': ['dist/thankyou.css']
				}
			}
		},

		/* SERVING */

		connect: {
			localhost: {
				options: {
					port: 9000,
					hostname: 'localhost',
					livereload: true,
					open: true
				}
			}
		},

		watch: {
			css: {
        files: 'css/main.css',
        tasks: ['concat:cssmin']
      },
			js: {
        files: 'js/app.js',
        tasks: ['jshint', 'uglify:dev']
      },
			html: {
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
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-uncss');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('test', [
		'jshint',
		'jasmine'
	]);

	grunt.registerTask('default', [
		'clean',
		'jshint',
		'jasmine',
		'uglify:dist',
		'uncss',
		'cssmin:dist'
	]);

	grunt.registerTask('distserve', [
		'connect',
		'watch'
	]);

	grunt.registerTask('serve', [
		'jshint',
		'uglify:dev',
		'concat:fakecssmin',
		'connect',
		'watch'
	]);

};
