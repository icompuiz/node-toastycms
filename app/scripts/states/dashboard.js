/**
 * Defines the main routes in the application.
 * The routes you see here will be anchors '#/' unless specifically configured otherwise.
 */

define(['./module'], function(states) {
		'use strict';

		return states.config(['$stateProvider', '$urlRouterProvider',
				function($stateProvider, $urlRouterProvider) {
						$stateProvider.state('management.dashboard', {
								templateUrl: 'partials/management/dashboard',
								abstract: true,
								url: '/dashboard'
						});

						$stateProvider.state('management.dashboard.home', {
								url: '/home',
								views: {
									'content-area': {
										templateUrl: 'partials/management/dashboard/home'
									},
									'sidebar-left': {
										templateUrl: 'partials/management/sidebar/default',
										controller: 'SidebarCtrl'
									}
								}
						});
				}
		]);
});
