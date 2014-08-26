define(['./module'], function(states) {
    'use strict';

    return states.config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            // base state for module
            $stateProvider.state('management.authenticated.scripts', {
                url: '',
                abstract: true,
                views: {
                    'authenticated': {
                        templateUrl: 'partials/management/scripts/index'
                    },
                }
            });

            $stateProvider.state('management.authenticated.scripts.home', {
                url: '/scripts',
                views: {
                    'ui-scripts-body': {
                        templateUrl: 'partials/management/scripts/home',
                        controller: 'ScriptCtrl'
                    }
                }

            });

            $stateProvider.state('management.authenticated.scripts.add', {
                url: '/scripts/add',
                views: {
                    'ui-scripts-body': {
                        templateUrl: 'partials/management/scripts/add',
                        controller: 'ScriptCtrl'
                    }
                }
            });

            $stateProvider.state('management.authenticated.scripts.edit', {
                url: '/scripts/edit/:id',
                views: {
                    'ui-scripts-body': {
                        templateUrl: 'partials/management/scripts/add',
                        controller: 'ScriptCtrl'
                    }
                }
            });
        }
    ]);
});
