/**
 * configure RequireJS
 * prefer named modules to long paths, especially for version mgt
 * or 3rd party libraries
 */
requirejs.config({
    paths: {
        'domReady': '../bower_components/requirejs-domready/domReady',
        'angular': '../bower_components/angular/angular',
        'angular-ui-router': '../bower_components/angular-ui-router/release/angular-ui-router',
        'handlebars': '../bower_components/handlebars/handlebars',
        '_': '../bower_components/lodash/dist/lodash',
        '$': '../bower_components/jquery/dist/jquery',
        'angular-bootstrap': '../bower_components/angular-bootstrap/ui-bootstrap',
        'restangular': '../bower_components/restangular/dist/restangular.min',
        'angular-file-upload': '../bower_components/angular-file-upload/angular-file-upload.min',
        'async': '../bower_components/async/lib/async',
    },

    /**
     * for libs that either do not support AMD out of the box, or
     * require some fine tuning to dependency mgt'
     */
    shim: {
        'angular': {
            exports: 'angular'
        },
        'restangular': {
            deps: ['angular', '_'],
        },
        'angular-ui-router': {
            deps: ['angular']
        }
        '_': {
            exports: '_'
        }
    },

    deps: [
        // kick start application... see bootstrap.js
        './bootstrap'
    ]
});
