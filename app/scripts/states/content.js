define(['./module'], function (states) {
    'use strict';

    return states.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $stateProvider.state('management.content', {
            url:'/content',
            templateUrl: 'partials/management/content/index',
            controller: function() {}
        });

    }]);
});