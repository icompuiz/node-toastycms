define(['./module'], function (states) {
    'use strict';

    return states.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $stateProvider.state('management.authenticated.content-templates', {
            url:'',
            abstract: true,
            views: {
				'authenticated': {
            		templateUrl: 'partials/management/content-templates/index',
				},
			}
        });

        
        $stateProvider.state('management.authenticated.content-templates.home', {
        	url: '/content-templates',
        	views: {
        		'ui-content-templates': {
            		templateUrl: 'partials/management/content-templates/home',
        		}
        	}

        });

        $stateProvider.state('management.authenticated.content-templates.add', {
            url:'/content-templates/add',
            views: {
        		'ui-content-templates': {
            		templateUrl: 'partials/management/content-templates/add',
        		}
        	}
        });

    }]);
});