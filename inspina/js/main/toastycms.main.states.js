/* global define: true */

'use strict';
define(['./_mod'], function(states) {

    var stateConfig = ['$stateProvider', '$urlRouterProvider', function stateConfig($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/main');
        $stateProvider
            .state('main', {
                url: '/main',
                templateUrl: 'partials/main',
                data: {
                    pageTitle: 'Example view'
                }
            })
            .state('minor', {
                url: '/minor',
                templateUrl: 'partials/minor',
                data: {
                    pageTitle: 'Example view'
                }
            });
    }];

    states.config(stateConfig)
        .run(function($rootScope, $state) {
            $rootScope.$state = $state;
        });

});