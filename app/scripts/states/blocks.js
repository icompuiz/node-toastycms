define(['./module'], function(states) {
    'use strict';

    return states.config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            // base state for module
            $stateProvider.state('management.authenticated.blocks', {
                url: '',
                abstract: true,
                views: {
                    'authenticated': {
                        templateUrl: 'partials/management/blocks/index'
                    },
                }
            });

            $stateProvider.state('management.authenticated.blocks.home', {
                url: '/blocks',
                views: {
                    'ui-blocks-body': {
                        templateUrl: 'partials/management/blocks/home',
                        controller: 'BlockCtrl'
                    }
                }

            });

            $stateProvider.state('management.authenticated.blocks.add', {
                url: '/blocks/add',
                views: {
                    'ui-blocks-body': {
                        templateUrl: 'partials/management/blocks/add',
                        controller: 'BlockCtrl'
                    }
                }
            });

            $stateProvider.state('management.authenticated.blocks.edit', {
                url: '/blocks/edit/:id',
                views: {
                    'ui-blocks-body': {
                        templateUrl: 'partials/management/blocks/add',
                        controller: 'BlockCtrl'
                    }
                }
            });
        }
    ]);
});
