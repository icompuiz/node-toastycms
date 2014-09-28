define(['./module'], function(states) {
    'use strict';

    return states.config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {

            // base state for module
            $stateProvider.state('management.authenticated.content', {
                url: '',
                abstract: true,
                views: {
                    'authenticated': {
                        templateUrl: 'partials/management/content/index'
                    },
                }
            });

            $stateProvider.state('management.authenticated.content.home', {
                url: '/content',
                views: {
                    'ui-content-body': {
                        templateUrl: 'partials/management/content/home',
                        controller: 'ContentCtrl'
                    }
                }

            });

            $stateProvider.state('management.authenticated.content.add', {
                url: '/content/add',
                views: {
                    'ui-content-body': {
                        templateUrl: 'partials/management/content/add',
                        controller: 'AddContentCtrl'
                    }
                }
            });

            $stateProvider.state('management.authenticated.content.edit', {
                url: '/content/edit/:id',
                views: {
                    'ui-content-body': {
                        templateUrl: 'partials/management/content/add',
                        controller: 'AddContentCtrl'
                    }
                }
            });

        }
    ]);
});
