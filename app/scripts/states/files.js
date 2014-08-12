/* global define:true */

define(['./module'], function(states) {
		'use strict';

		return states.config(['$stateProvider',
				function($stateProvider) {

						$stateProvider.state('management.authenticated.files', {
								url: '',
								abstract: true,
								views: {
										'authenticated': {
												templateUrl: 'partials/management/files/index',
										},
								}
						});

						$stateProvider.state('management.authenticated.files.home', {
								url: '/files',
								views: {
										'ui-files': {
												templateUrl: 'partials/management/files/home',
												controller: 'FilesCtrl'
										},
								}
						});

						$stateProvider.state('management.authenticated.files.add', {
								url: '/add',
								parent: 'management.authenticated.files.home',
								views: {
										'ui-files-body': {
												templateUrl: 'partials/management/files/add',
										},
								}
						});

				}
		]);
});
