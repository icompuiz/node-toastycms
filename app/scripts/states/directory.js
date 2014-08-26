/* global define:true */

define(['./module'], function(states) {
    'use strict';

    return states.config(['$stateProvider',
        function($stateProvider) {
            // base state for module
            $stateProvider.state('management.authenticated.directory', {
                url: '',
                abstract: true,
                views: {
                    'authenticated': {
                        templateUrl: 'partials/management/directory/index'
                    },
                }
            });

            $stateProvider.state('management.authenticated.directory.home', {
                url: '/directory',
                views: {
                    'ui-directory-body': {
                        templateUrl: 'partials/management/directory/home',
                        controller: 'FilesCtrl'
                    }
                }

            });

            $stateProvider.state('management.authenticated.directory.add', {
                url: '/directory/add',
                views: {
                    'ui-directory-body': {
                        templateUrl: 'partials/management/directory/add',
                        controller: 'FilesCtrl'
                    }
                }
            });

            $stateProvider.state('management.authenticated.directory.edit', {
                url: '/directory/edit/:id',
                views: {
                    'ui-directory-body': {
                        templateUrl: 'partials/management/directory/add',
                        controller: 'FilesCtrl'
                    }
                }
            });

        }
    ]);
});
