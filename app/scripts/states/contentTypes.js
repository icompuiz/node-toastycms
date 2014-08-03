define(['./module'], function (states) {
    'use strict';

    return states.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $stateProvider.state('management.authenticated.content-types', {
            url:'',
            abstract: true,
            views: {
				'authenticated': {
            		templateUrl: 'partials/management/content-types/index',
				},
			}
        });

        
        $stateProvider.state('management.authenticated.content-types.home', {
        	url: '/content-types',
        	views: {
        		'ui-content-types': {
            		templateUrl: 'partials/management/content-types/home',
                }
            }

        });

        $stateProvider.state('management.authenticated.content-types.add', {
            url:'/add',
            parent: 'management.authenticated.content-types.home',
            views: {
                'ui-content-types-body': {
                    templateUrl: 'partials/management/content-types/add',
                    controller: 'ContentTypesCtrl'
        		}
        	}
        });

    }]);
});