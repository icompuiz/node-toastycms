/**
 * Defines the main routes in the application.
 * The routes you see here will be anchors '#/' unless specifically configured otherwise.
 */

define(['./module'], function (states) {
    'use strict';

    return states.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $stateProvider.state('login', {
            url: '/login',
            template: '<div>login</html>',
            controller: function() {}
        });

        $stateProvider.state('home', {
            url:'/home',
            template: '<div>home</html>',
            controller: function() {}
        });

    }]);
});
