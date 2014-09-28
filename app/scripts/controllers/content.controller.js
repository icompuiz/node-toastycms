/* global define:true, _: true */

define(['./module'], function(controllers) {
    'use strict';

    return controllers.controller('ContentCtrl', ['$rootScope', '$scope', '$http', '$log', '$state', 'Restangular', 'AuthenticationSvc', 'ToastySessionSvc', '$stateParams', '$modal','ContentModel',
        function($rootScope, $scope, $http, $log, $state, Restangular, AuthenticationSvc, ToastySessionSvc, $stateParams, $modal, ContentModel) {

            if ($state.is("management.authenticated.content.home")) {

                if ($stateParams.alert) {
                    $scope.setAlert($stateParams.alert);
                }

            }

        }
    ]);

});