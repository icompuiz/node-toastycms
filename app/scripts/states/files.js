define(['./module'], function (states) {
    'use strict';

    return states.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $stateProvider.state('management.authenticated.files', {
            url:'',
            abstract: true,
            views: {
				'authenticated': {
            		templateUrl: 'partials/management/files/index',
				},
			}
        });

        $stateProvider.state('management.authenticated.files.home', {
            url:'/files',
            views: {
				'ui-files': {
            		templateUrl: 'partials/management/files/home',
				},
			}
        });

    }]);
});