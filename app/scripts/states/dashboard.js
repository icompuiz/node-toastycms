/**
 * Defines the main routes in the application.
 * The routes you see here will be anchors '#/' unless specifically configured otherwise.
 */

define(['./module'], function(states) {
    'use strict';

    return states.config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {

            $stateProvider.state('management.authenticated.dashboard', {
                url: '',
                views: {
                    'authenticated': {
                        templateUrl: 'partials/management/dashboard/index'
                    }
                }
            });

            $stateProvider.state('management.authenticated.dashboard.home', {
                url: '/dashboard',
                views: {
                    dashboard: {
                        templateUrl: 'partials/management/dashboard/home'
                    }
                }
            });

        }
    ]);
});
