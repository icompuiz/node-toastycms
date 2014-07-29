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
								templateUrl: 'partials/management/index',
								controller: function($rootScope, $state, AuthenticationSvc) {
										if (AuthenticationSvc.isLoggedIn()) {
												$state.go('management.dashboard.home');
												// $rootScope.$broadcast('toasty.loginSuccess');

										} else {
												$state.go('management.login');
										}
								}
						});

						$stateProvider.state('management.login', {
								url: '/login',
								templateUrl: 'partials/management/loginlogout/login',
								controller: 'LoginCtrl'
						});

						$stateProvider.state('management.logout', {
								url: '/logout',
								templateUrl: 'partials/management/loginlogout/logout',
								controller: function() {}
						});

				}
		]);
});
