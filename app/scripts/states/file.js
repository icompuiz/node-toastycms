define(['./module'], function (states) {
    'use strict';

    return states.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $stateProvider.state('management.files', {
            url:'/files',
            templateUrl: 'partials/management/files/index',
            controller: function() {}
        });

    }]);
});