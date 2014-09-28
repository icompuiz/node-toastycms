define(['./module'], function (states) {
    'use strict';

    return states.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        // base state for module
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
        		'ui-content-types-body': {
            		templateUrl: 'partials/management/content-types/home',
                    controller: 'ContentTypesCtrl'
                }
            }

        });

        $stateProvider.state('management.authenticated.content-types.add', {
            url:'/content-types/add',
            views: {
                'ui-content-types-body': {
                    templateUrl: 'partials/management/content-types/add',
                    controller: 'AddContentTypesCtrl'
        		}
        	}
        });

        $stateProvider.state('management.authenticated.content-types.edit', {
            url:'/content-types/edit/:id',
            views: {
                'ui-content-types-body': {
                    templateUrl: 'partials/management/content-types/add',
                    controller: 'AddContentTypesCtrl'
                }
            }
        });

    }]);
});