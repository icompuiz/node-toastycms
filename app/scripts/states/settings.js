/* global define:true */

define(['./module'], function(states) {
    'use strict';

    return states.config(['$stateProvider',
        function($stateProvider) {
            // base state for module
            $stateProvider.state('management.authenticated.settings', {
                url: '',
                abstract: true,
                views: {
                    'authenticated': {
                        templateUrl: 'partials/management/settings/index',
                        controller: 'SettingsCtrl'
                    },
                }
            });

            $stateProvider.state('management.authenticated.settings.home', {
                url: '/settings',
                views: {
                    'ui-settings-body': {
                        templateUrl: 'partials/management/settings/home',
                        controller: 'SettingsCtrl'
                    }
                }

            });
        }
    ]);
});
