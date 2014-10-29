/* global define:true */

define(['./module'], function(states) {
    'use strict';

    return states.config(['$stateProvider',
        function($stateProvider) {
            // base state for module

            $stateProvider.state('management.authenticated.directories', {
                url: '',
                abstract: true,
                views: {
                    'authenticated': {
                        templateUrl: 'partials/management/files/index',
                        controller: ['$scope','$state',function FileSystemCtrl($scope, $state) {

                            $scope.openNode = function(node) {

                                var destination = 'management.authenticated.files.edit';
                                if (node.__t === 'Directory') {
                                    destination = 'management.authenticated.directories.edit';
                                }

                                $state.go(destination, {
                                    id: node._id,
                                    type: node.__t
                                });

                            };

                        }]
                    },
                }
            });


            $stateProvider.state('management.authenticated.directories.home', {
                url: '/directories',
                views: {
                    'ui-files-body': {
                        templateUrl: 'partials/management/directories/home',
                        controller: 'DirectoriesCtrl'
                    }
                }

            });

            $stateProvider.state('management.authenticated.directories.add', {
                url: '/directories/add',
                views: {
                    'ui-files-body': {
                        templateUrl: 'partials/management/directories/add',
                        controller: 'DirectoriesCtrl'
                    }
                }
            });

            $stateProvider.state('management.authenticated.directories.edit', {
                url: '/directories/edit/:id',
                views: {
                    'ui-files-body': {
                        templateUrl: 'partials/management/directories/add',
                        controller: 'DirectoriesCtrl'
                    }
                }
            });

        }
    ]);
});
