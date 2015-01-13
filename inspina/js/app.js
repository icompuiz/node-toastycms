/**
 * loads sub modules and wraps them up into the main module
 * this should be used for top-level module definitions only
 */
define('app', [
    'angular',
    'angular-ui-router',
    'angular-bootstrap',
    'restangular',
    'toastycms-tpls',
    'main/_man'
], function(ng) {
    'use strict';

    return ng.module('toastycms', [
        'restangular',
        'ui.bootstrap',
        'ui.bootstrap.tpls',
        'ui.router',
        'toastycms.tpls',
        'toastycms.main'
    ]).config(['$locationProvider',
        function($locationProvider) {

            // $locationProvider.html5Mode(true).hashPrefix('!');

        }
    ]).run(['$state', '$rootScope', 'Restangular',
        function($state, $rootScope, Restangular) {

            Restangular.setBaseUrl('/api');

            Restangular.setRestangularFields({
                id: "_id",
            });

            // Restangular.all('settings').getList().then(function(settings) {

            //     $rootScope.settings = {};
            //     _.forEach(settings, function(setting) {
            //         $rootScope.settings[setting.alias] = setting;
            //     });

            // });

        }
    ]);
});
