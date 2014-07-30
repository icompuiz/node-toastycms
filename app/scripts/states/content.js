define(['./module'], function (states) {
    'use strict';

    return states.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $stateProvider.state('management.authenticated.content', {
            url:'',
            abstract: true,
            views: {
				'authenticated': {
            		templateUrl: 'partials/management/content/index',
				},
			}
        });

        
        $stateProvider.state('management.authenticated.content.home', {
        	url: '/content',
        	views: {
        		'ui-content': {
            		templateUrl: 'partials/management/content/home',
        		}
        	}

        });

        $stateProvider.state('management.authenticated.content.add', {
            url:'/content/add',
            views: {
        		'ui-content': {
            		templateUrl: 'partials/management/content/add',
        		}
        	}
        });

    }]);
});