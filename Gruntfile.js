// Generated on 2014-05-18 using generator-angular 0.8.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'
module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: {
      // configurable paths
      app: require('./bower.json').appPath || 'inspina',
      dist: 'client',
      server: 'server',
      tmp: '.tmp'

    },

    express: {
      options: {
        hostname: 'localhost',
        port: 9000
      },
      dev: {
        options: {
          script: 'server.js'
        },
      },
      initdb: {
        options: {
          script: 'server.js',
          args: [
            '--initdb'
          ]

        },
      }
    },

    open: {
      server: {
        url: 'http://<%= express.options.hostname %>:<%= express.options.port %>'
      }
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: [
          '<%= yeoman.app %>/js/**/*.js'
        ],
        tasks: [
          // 'newer:jshint:all',
          'copy:dist'
        ],
      },
      jsTest: {
        files: [
          'test/spec/{,*/}*.js'
        ],
        tasks: [
          'newer:jshint:test', 'karma'
        ]
      },
      compass: {
        files: [
          '<%= yeoman.app %>/css/{,*/}*.{scss,sass}'
        ],
        tasks: [
          'compass:server', 'autoprefixer', 'copy:dist'
        ]
      },
      gruntfile: {
        files: [
          'Gruntfile.js'
        ]
      },
      views: {
        files: [
          '<%= yeoman.app %>/views/**/*.{jade,html}'
        ],
        tasks: [
          'jade', 'html2js', 'copy:dist'
        ]
      },
      express: {
        files: ['<%= yeoman.server %>/{,*/}*.js'],
        tasks: ['express:dev'],
        options: {
          livereload: true
        }
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/css/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        port: 9000,
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            '<%= yeoman.app %>'
          ]
        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            '.tmp',
            'test',
            '<%= yeoman.app %>'
          ]
        }
      },
      dist: {
        options: {
          base: '<%= yeoman.dist %>'
        }
      }
    },


    // Make sure code css are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/js/{,*/}*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: [
          'test/spec/{,*/}*.js'
        ]
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.sass-cache',
            '<%= yeoman.tmp %>',
            '<%= yeoman.dist %>',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      }
    },

    // Add vendor prefixed css
    autoprefixer: {
      options: {
        browsers: [
          'last 1 version'
        ]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.tmp %>/css/',
          src: '{,*/}*.css',
          dest: '<%= yeoman.tmp %>/css/'
        }]
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    // compass: {
    //   options: {
    //     sassDir: '<%= yeoman.app %>/css',
    //     cssDir: '<%= yeoman.tmp %>/css',
    //     generatedImagesDir: '<%= yeoman.tmp %>/images/generated',
    //     imagesDir: '<%= yeoman.app %>/images',
    //     javascriptsDir: '<%= yeoman.app %>/scripts',
    //     fontsDir: '<%= yeoman.app %>/css/fonts',
    //     importPath: '<%= yeoman.app %>/bower_components',
    //     httpImagesPath: '/images',
    //     httpGeneratedImagesPath: '/images/generated',
    //     httpFontsPath: '/css/fonts',
    //     relativeAssets: false,
    //     assetCacheBuster: false,
    //     raw: 'Sass::Script::Number.precision = 10\n'
    //   },
    //   dist: {
    //     options: {
    //       generatedImagesDir: '<%= yeoman.dist %>/images/generated'
    //     }
    //   },
    //   server: {
    //     options: {
    //       debugInfo: false
    //     }
    //   }
    // },



    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
            expand: true,
            dot: true,
            cwd: '<%= yeoman.app %>',
            dest: '<%= yeoman.dist %>',
            src: [
              '*.{ico,png,txt}',
              '*.html',
              'views/{,*/}*.html',
              'images/{,*/}*.{webp}',
              'fonts/*'
            ]
          }, {
            expand: true,
            cwd: '<%= yeoman.tmp %>/images',
            dest: '<%= yeoman.dist %>/images',
            src: [
              'generated/*'
            ]
          }, {
            expand: true,
            cwd: '<%= yeoman.app %>/images',
            dest: '<%= yeoman.dist %>/images',
            src: '**/*'
          },
          // Copy application icon
          {
            src: '<%= yeoman.app %>/favicon.ico',
            dest: '<%= yeoman.dist %>/favicon.ico'
          },
          // Copy application components
          {
            expand: true,
            cwd: '<%= yeoman.app %>/components/',
            src: '**/*',
            dest: '<%= yeoman.dist %>/components/'
          },
          // Copy application bower components
          {
            expand: true,
            cwd: '<%= yeoman.app %>/bower_components/',
            src: '**/*',
            dest: '<%= yeoman.dist %>/bower_components/'
          },
          // Copy application scripts
          {
            expand: true,
            cwd: '<%= yeoman.app %>/js/',
            src: '**/*.js',
            dest: '<%= yeoman.dist %>/js/'
          },
          // Copy application css
          {
            expand: true,
            cwd: '<%= yeoman.app %>/css/',
            src: '{,*/}*.css',
            dest: '<%= yeoman.dist %>/css/'
          },
          {
            expand: true,
            cwd: '<%= yeoman.app %>/font-awesome/',
            src: '**/*',
            dest: '<%= yeoman.dist %>/font-awesome/'
          },
          {
            expand: true,
            cwd: '<%= yeoman.app %>/font/',
            src: '{,*/}*',
            dest: '<%= yeoman.dist %>/font/'
          },
          {
            expand: true,
            cwd: '<%= yeoman.app %>/img/',
            src: '{,*/}*',
            dest: '<%= yeoman.dist %>/img/'
          },
          {
            expand: true,
            cwd: '<%= yeoman.app %>/views/',
            src: '{,*/}*.jade',
            dest: '<%= yeoman.dist %>/views/'
          }
        ]
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [

        'compass:server'
      ],
      test: [

        'compass'
      ],
      dist: [

        'compass:dist'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },

    // Jade Settings
    jade: {
      options: {
      },
      files: {
        extDot: 'last',
        expand: true,
        cwd: '<%= yeoman.app %>/views',
        src: '**/*.jade',
        dest: '<%= yeoman.tmp %>/views/',
        ext: '.html',

      }
    },

    html2js: {
      options: {
        base: '.',
        module: 'toastycms.tpls',
        rename: function(modulePath) {
          var moduleName = modulePath.replace('.tmp/views/', '').replace('.html', '');
          console.log(moduleName);
          return moduleName;
        }
      },
      main: {
        src: [
          '<%= yeoman.tmp %>/views/**/*.html'
        ],
        dest: '<%= yeoman.dist %>/js/toastycms-tpls.js'
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-html2js');



  grunt.registerTask('build', [

    'clean:dist',
    // 'concurrent:dist',
    'autoprefixer',
    'jade',
    'html2js',
    'copy:dist'
  ]);

  grunt.registerTask('default', [

    // 'newer:jshint',
    // 'test'
    'build',
    'watch'
  ]);
};
