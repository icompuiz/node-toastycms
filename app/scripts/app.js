/**
 * loads sub modules and wraps them up into the main module
 * this should be used for top-level module definitions only
 */
define('app', [
    'angular',
    'angular-ui-router',
    'angular-bootstrap',
    
    // 'text!',
    'restangular',
], function(ng) {
    'use strict';

    return ng.module('toastycms', [
        'restangular',
        'ui.bootstrap',
        'ui.bootstrap.tpls',
        'ui.router',
        'ui.tree'
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
