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
                    controller: 'ContentTemplatesCtrl'
                }
            }

        });

        $stateProvider.state('management.authenticated.content-templates.add', {
            url:'/add',
            parent: 'management.authenticated.content-templates.home',
            views: {
                'ui-content-templates-body': {
                    templateUrl: 'partials/management/content-templates/add',
                    controller: 'ContentTemplatesCtrl'
        		}
        	}
        });

        $stateProvider.state('management.authenticated.content-templates.edit', {
            url:'/edit/:id',
            parent: 'management.authenticated.content-templates.home',
            views: {
                'ui-content-templates-body': {
                    templateUrl: 'partials/management/content-templates/add',
                    controller: 'ContentTemplatesCtrl'
                }
            }
        });

    }]);
});