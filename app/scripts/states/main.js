/**
 * Defines the main routes in the application.
 * The routes you see here will be anchors '#/' unless specifically configured otherwise.
 */

define(['./module'], function(states) {
    'use strict';

    return states.config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {

            $stateProvider.state('website', {
                url: '/',
                template: 'welcome',
                controller: function() {}
            });

            $stateProvider.state('management', {
                url: '/management',
                templateUrl: 'partials/management/base',
                controller: function($rootScope, $state, AuthenticationSvc) {

                    if (!AuthenticationSvc.isLoggedIn()) {
                        $state.go('login');
                    } else {
                        $rootScope.openNode = function(node) {
                            $state.go('^.edit', {
                                id: node._id
                            });
                        };

                        $rootScope.refreshTree = function() {
                            $rootScope.$broadcast('management.refresh-tree');
                        };

                        $rootScope.alerts = [];
                        $rootScope.addAlert = function(alert) {
                            $rootScope.alerts.push(alert);
                        };

                        $rootScope.setAlert = function(alert) {
                            $rootScope.alerts = [alert];
                        };

                        $rootScope.closeAlert = function(alert) {
                            var index = $rootScope.alerts.indexOf(alert);
                            $rootScope.alerts.splice(index, 1);
                        };

                        if ($state.current.name === 'management') {
                            $state.go('management.authenticated.dashboard.home');
                        }
                    }
                }
            });

            $stateProvider.state('login', {
                url: '/management/login',
                templateUrl: 'partials/management/loginlogout/login',
                controller: 'LoginCtrl'
            });

        }
    ]);
});
