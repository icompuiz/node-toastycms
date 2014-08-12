/* global define:true */

define(['./module'], function(states) {
    'use strict';

    return states.config(['$stateProvider',
        function($stateProvider) {

            $stateProvider.state('management.authenticated.settings', {
                url: '',
                abstract: true,
                views: {
                    'authenticated': {
                        templateUrl: 'partials/management/settings/index',
                    },
                }
            });

            $stateProvider.state('management.authenticated.settings.home', {
                url: '/settings',
                views: {
                    'ui-settings': {
                        templateUrl: 'partials/management/settings/home',
                    },
                }
            });
        }
    ]);
});
