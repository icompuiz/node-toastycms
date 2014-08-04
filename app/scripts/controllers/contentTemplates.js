define(['./module'], function(controllers) {
    'use strict';

    return controllers.controller('ContentTemplatesCtrl', ['$scope', '$http', '$log', '$state', 'Restangular', 'AuthenticationSvc', 'ToastySessionSvc','$stateParams',
        function($scope, $http, $log, $state, Restangular, AuthenticationSvc, ToastySessionSvc, $stateParams) {

            $scope.model = {};

            $scope.openNode = function(node) {

            	$state.go('management.authenticated.content-templates.edit', { id: node._id });

            };

            $scope.save = function() {


                if ($scope.model._id) {
                    var requestPromise = $scope.model.put();

                    requestPromise.then(function(putResult) {
                        $log.debug(putResult);
                    });
                } else {
                    var requestPromise = Restangular.all('templates').post($scope.model);

                    requestPromise.then(function(postResult) {

                        $log.debug(postResult);

                        $scope.model = postResult;

                    }, function(error) {

                        $log.error(error);

                    });
                }




            };

            $scope.cancel = function() {

            	$state.go('management.authenticated.content-templates.home');

            };

            if ($stateParams.id) {
            	Restangular.one('templates', $stateParams.id).get().then(function(getResult) {
            		$scope.model = getResult;
            	}, function(error) {
            		$log.error(error);
            	});
            }


        }
    ]);
});
