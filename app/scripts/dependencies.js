/**
 * configure RequireJS
 * prefer named modules to long paths, especially for version mgt
 * or 3rd party libraries
 */
requirejs.config({
    packages: [{
        name: 'codemirror',
        location: '../bower_components/codemirror',
        main: 'lib/codemirror'
    }],
    paths: {
        'domReady': '../bower_components/requirejs-domready/domReady',
        'angular': '../bower_components/angular/angular',
        'angular-ui-router': '../bower_components/angular-ui-router/release/angular-ui-router',
        'angular-ui-tree': '../bower_components/angular-ui-tree/dist/angular-ui-tree.min',
        'handlebars': '../bower_components/handlebars/handlebars',
        // 'text': '../bower_components/requirejs-text/text',
        '_': '../bower_components/lodash/dist/lodash',
        '$': '../bower_components/jquery/dist/jquery',
        'angular-bootstrap': '../bower_components/angular-bootstrap/ui-bootstrap',
        'restangular': '../bower_components/restangular/dist/restangular.min',
        'angular-bootstrap-tmpls': '../bower_components/angular-bootstrap/ui-bootstrap-tpls',
        'ckeditor': '../bower_components/ng-ckeditor/libs/ckeditor/ckeditor',
        'ng-ckeditor': '../bower_components/ng-ckeditor/ng-ckeditor.min',
        'ui-codemirror': '../bower_components/angular-ui-codemirror/ui-codemirror',
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
        },
        'ng-ckeditor': {
            deps: ['angular', 'ckeditor']
        },
        'ui-codemirror': {
            deps: ['angular', 'codemirror']
        },
        'angular-ui-tree': {
            deps: ['angular']
        },
        'handlebars': {
            exports: 'Handlebars'
        },
        '_': {
            exports: '_'
        },
        'angular-bootstrap-tmpls': {
            deps: ['angular']
        },
        'angular-bootstrap': {
            deps: ['angular', '$', 'angular-bootstrap-tmpls']
        }
    },

    deps: [
        // kick start application... see bootstrap.js
        './bootstrap'
    ]
});
