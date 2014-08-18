define(['./module'], function(states) {
    'use strict';

    return states.config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {

            $stateProvider.state('management.authenticated.content', {
                url: '',
                abstract: true,
                views: {
                    'authenticated': {
                        templateUrl: 'partials/management/content/index',
                        controller: function($rootScope, $scope, $state) {
                            $scope.openNode = function(node) {

                                $state.go('^.edit', {
                                    id: node._id
                                });

                            };

                            $scope.refreshTree = function() {
                                $rootScope.$broadcast('management.refresh-tree');
                            };
                        }
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
                parent: 'management.authenticated.content',
                views: {
                    'ui-content-body': {
                        templateUrl: 'partials/management/content/add',
                        controller: 'ContentCtrl'
                    }
                }
            });

            $stateProvider.state('management.authenticated.content.edit', {
                url: '/content/edit/:id',
                parent: 'management.authenticated.content',
                views: {
                    'ui-content-body': {
                        templateUrl: 'partials/management/content/add',
                        controller: 'ContentCtrl'
                    }
                }
            });

        }
    ]);
});
