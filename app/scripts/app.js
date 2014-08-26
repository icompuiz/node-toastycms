/**
 * loads sub modules and wraps them up into the main module
 * this should be used for top-level module definitions only
 */
define('app', [
    'angular',
    'angular-ui-router',
    'angular-ui-tree',
    'angular-bootstrap',
    // 'text!',
    'restangular',
    'ng-ckeditor',
    './controllers/index',
    './directives/index',
    './directives/input-formats/index',
    './services/index',
    './models/index',
    './states/index'
], function(ng) {
    'use strict';

    return ng.module('toastycms', [
        'toastycms.controllers',
        'restangular',
        'ngCkeditor',
        'toastycms.directives',
        'toastycms.services',
        'toastycms.states',
        'ui.bootstrap',
        'ui.bootstrap.tpls',
        'ui.router',
        'ui.tree'
    ]).config(['$locationProvider',
        function($locationProvider) {

            $locationProvider.html5Mode(true).hashPrefix('!');

        }
    ]).run(['$state', '$rootScope', 'Restangular',
        function($state, $rootScope, Restangular) {

            Restangular.setBaseUrl('/api');

            Restangular.setRestangularFields({
                id: "_id",
            });

            Restangular.all('settings').getList().then(function(settings) {

                $rootScope.settings = {};
                _.forEach(settings, function(setting) {
                    $rootScope.settings[setting.alias] = setting;
                });

            });

        }
    ]);
});
