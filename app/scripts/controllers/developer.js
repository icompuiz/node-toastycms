define(['./module'], function(controllers) {
    'use strict';

    return controllers.controller('DeveloperCtrl', ['$rootScope', '$scope', '$http', '$log', '$state', 'Restangular', 'AuthenticationSvc', 'ToastySessionSvc', '$stateParams', '$modal',
        function($rootScope, $scope, $http, $log, $state, Restangular, AuthenticationSvc, ToastySessionSvc, $stateParams, $modal) {
            if ($stateParams.alert) {
                $scope.setAlert($stateParams.alert);
            }
        }
    ]);

});
