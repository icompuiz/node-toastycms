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
