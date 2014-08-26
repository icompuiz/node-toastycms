/* global define:true */

define(['./module'], function(states) {
    'use strict';

    return states.config(['$stateProvider',
        function($stateProvider) {
            // base state for module
            $stateProvider.state('management.authenticated.files', {
                url: '',
                abstract: true,
                views: {
                    'authenticated': {
                        templateUrl: 'partials/management/files/index'
                    },
                }
            });

            $stateProvider.state('management.authenticated.files.home', {
                url: '/files',
                views: {
                    'ui-files-body': {
                        templateUrl: 'partials/management/files/home',
                        controller: 'FilesCtrl'
                    }
                }

            });

            $stateProvider.state('management.authenticated.files.add', {
                url: '/files/add/:type',
                views: {
                    'ui-files-body': {
                        templateUrl: 'partials/management/files/add',
                        controller: 'FilesCtrl'
                    }
                }
            });

            $stateProvider.state('management.authenticated.files.edit', {
                url: '/files/edit/:id/:type',
                views: {
                    'ui-files-body': {
                        templateUrl: 'partials/management/files/add',
                        controller: 'FilesCtrl'
                    }
                }
            });

        }
    ]);
});
