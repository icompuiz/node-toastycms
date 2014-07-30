/**
 * Defines the main routes in the application.
 * The routes you see here will be anchors '#/' unless specifically configured otherwise.
 */

define(['./module'], function(states) {
		'use strict';

		return states.config(['$stateProvider', '$urlRouterProvider',
				function($stateProvider, $urlRouterProvider) {
						
						$stateProvider.state('management.authenticated', {
								abstract: true,
								views: {
									'body': {
										template: '<div ui-view="authenticated"></div>'
									},
									'sidebar': {
										templateUrl: 'partials/management/sidebar',
										controller: 'SidebarCtrl'
									}
								}
						});

				}
		]);
});
